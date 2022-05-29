import { Mock, It, Times } from "moq.ts";
import { CourseDescriptor } from "../shared/CourseDescriptor";
import { CompositePageParser } from "./CompositePageParser";
import { PageParser } from "./PageParser";

describe("Composite parser", () => {
  describe("when there are no nested parsers", () => {
    it("should return null", async () => {
      const composite = new CompositePageParser();

      const actualResult = await composite.parse(
        new URL("https://gianlucacosta.info/test")
      );

      expect(actualResult).toEqual(null);
    });
  });

  describe("when there is just one nested parser", () => {
    it("should return the value returned by the nested parser", async () => {
      const partialDescriptor: Partial<CourseDescriptor> = {
        title: "My title",
        minutes: 89
      };

      const subParserMock = new Mock<PageParser>()
        .setup(instance => instance.parse(It.IsAny()))
        .returns(Promise.resolve(partialDescriptor));

      const subParser = subParserMock.object();
      const composite = new CompositePageParser(subParser);

      const actualResult = await composite.parse(
        new URL("https://gianlucacosta.info/test")
      );

      expect(actualResult).toEqual(partialDescriptor);
    });
  });

  describe("when there are more nested parser", () => {
    it("should return the first non-null value", async () => {
      const secondResult: Partial<CourseDescriptor> = {
        title: "Second title",
        minutes: 200
      };

      const firstSubParserMock = new Mock<PageParser>()
        .setup(instance => instance.parse(It.IsAny()))
        .returns(Promise.resolve(null));

      const firstSubParser = firstSubParserMock.object();

      const secondSubParserMock = new Mock<PageParser>()
        .setup(instance => instance.parse(It.IsAny()))
        .returns(Promise.resolve(secondResult));

      const secondSubParser = secondSubParserMock.object();

      const thirdSubParserMock = new Mock<PageParser>()
        .setup(instance => instance.parse(It.IsAny()))
        .returns(Promise.resolve(null));

      const thirdSubParser = thirdSubParserMock.object();

      const composite = new CompositePageParser(
        firstSubParser,
        secondSubParser,
        thirdSubParser
      );

      const actualResult = await composite.parse(
        new URL("https://gianlucacosta.info/test")
      );

      expect(actualResult).toEqual(secondResult);

      firstSubParserMock.verify(instance => instance.parse(It.IsAny()));
      secondSubParserMock.verify(instance => instance.parse(It.IsAny()));
      thirdSubParserMock.verify(
        instance => instance.parse(It.IsAny()),
        Times.Never()
      );
    });
  });
});
