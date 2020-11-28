import { Mock, It, Times } from "moq.ts"
import { None, Some } from "optional-typescript"
import { CourseDescriptor } from "../shared/CourseDescriptor"
import { CompositePageParser } from "./CompositePageParser"
import { PageParser } from "./PageParser"

describe("Composite parser", () => {
  describe("when there are no nested parsers", () => {
    it("should return None", async () => {
      const composite = new CompositePageParser()

      const actualResult = await composite.parse(
        new URL("https://gianlucacosta.info/test")
      )

      expect(actualResult).toEqual(None())
    })
  })

  describe("when there is just one nested parser", () => {
    it("should return the value returned by the nested parser", async () => {
      const partialDescriptor: Partial<CourseDescriptor> = {
        title: "My title",
        minutes: 89
      }

      const subParserMock = new Mock<PageParser>()
        .setup((instance) => instance.parse(It.IsAny()))
        .returns(Promise.resolve(Some(partialDescriptor)))

      const subParser = subParserMock.object()
      const composite = new CompositePageParser(subParser)

      const actualResult = await composite.parse(
        new URL("https://gianlucacosta.info/test")
      )

      expect(actualResult).toEqual(Some(partialDescriptor))
    })
  })

  describe("when there are more nested parser", () => {
    it("should return the first non-None value", async () => {
      const secondResult: Partial<CourseDescriptor> = {
        title: "Second title",
        minutes: 200
      }

      const firstSubParserMock = new Mock<PageParser>()
        .setup((instance) => instance.parse(It.IsAny()))
        .returns(Promise.resolve(None()))

      const firstSubParser = firstSubParserMock.object()

      const secondSubParserMock = new Mock<PageParser>()
        .setup((instance) => instance.parse(It.IsAny()))
        .returns(Promise.resolve(Some(secondResult)))

      const secondSubParser = secondSubParserMock.object()

      const thirdSubParserMock = new Mock<PageParser>()
        .setup((instance) => instance.parse(It.IsAny()))
        .returns(Promise.resolve(None()))

      const thirdSubParser = thirdSubParserMock.object()

      const composite = new CompositePageParser(
        firstSubParser,
        secondSubParser,
        thirdSubParser
      )

      const actualResult = await composite.parse(
        new URL("https://gianlucacosta.info/test")
      )

      expect(actualResult).toEqual(Some(secondResult))

      firstSubParserMock.verify((instance) => instance.parse(It.IsAny()))
      secondSubParserMock.verify((instance) => instance.parse(It.IsAny()))
      thirdSubParserMock.verify(
        (instance) => instance.parse(It.IsAny()),
        Times.Never()
      )
    })
  })
})
