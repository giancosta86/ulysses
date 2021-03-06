import { CourseReference } from "./referenceParsing"
import { createMergedDescriptor } from "./mergedDescriptors"
import { Mock, Times, It } from "moq.ts"
import { None, Some } from "optional-typescript"
import { NopPageParser } from "./pageParsing/NopPageParser"
import { PageParser } from "./pageParsing/PageParser"
import { FailingPageParser } from "./pageParsing/FailingPageParser"

describe("Merged descriptor creation", () => {
  describe("when the url is missing", () => {
    it("should return the course reference itself", async () => {
      const courseReference: CourseReference = {
        title: "This is a test title",
        completionDate: "2020-01-01"
      }

      const mergedDescriptor = await createMergedDescriptor(
        new FailingPageParser(),
        courseReference
      )

      expect(mergedDescriptor).toEqual(courseReference)
    })
  })

  describe("when the URL is invalid", () => {
    it("should fail", async () => {
      const courseReference: CourseReference = {
        title: "This is a test title",
        completionDate: "2020-01-01",
        url: "INEXISTING"
      }

      expect(
        createMergedDescriptor(new NopPageParser(), courseReference)
      ).rejects.toThrow(new TypeError("Invalid URL: INEXISTING"))
    })
  })

  describe("when the URL is valid", () => {
    it("should call the parser", async () => {
      const parserMock = new Mock<PageParser>()
        .setup((instance) => instance.parse(It.IsAny()))
        .returns(Promise.resolve(None()))

      const parser = parserMock.object()

      const courseReference: CourseReference = {
        title: "This is a test title",
        completionDate: "2020-01-01",
        url: "https://www.pluralsight.com/courses/cryptography-big-picture"
      }

      await createMergedDescriptor(parser, courseReference)

      parserMock.verify((instance) => instance.parse(It.IsAny()), Times.Once())
    })

    describe("when the parser returns some empty object", () => {
      it("should return the unaltered course reference", async () => {
        const parserMock = new Mock<PageParser>()
          .setup((instance) => instance.parse(It.IsAny()))
          .returns(Promise.resolve(Some({})))

        const parser = parserMock.object()

        const courseReference: CourseReference = {
          title: "This is a test title",
          completionDate: "2020-01-01",
          url: "https://www.pluralsight.com/courses/cryptography-big-picture"
        }

        const mergedDescriptor = await createMergedDescriptor(
          parser,
          courseReference
        )

        expect(mergedDescriptor).toEqual(courseReference)
      })
    })

    describe("when the parser returns some non-empty object", () => {
      it("should overwrite existing fields", async () => {
        const parserMock = new Mock<PageParser>()
          .setup((instance) => instance.parse(It.IsAny()))
          .returns(Promise.resolve(Some({ title: "New title" })))

        const parser = parserMock.object()

        const courseReference: CourseReference = {
          title: "This is a test title",
          completionDate: "2020-01-01",
          url: "https://www.pluralsight.com/courses/cryptography-big-picture"
        }

        const mergedDescriptor = await createMergedDescriptor(
          parser,
          courseReference
        )

        expect(mergedDescriptor).toEqual({
          ...courseReference,
          title: "New title"
        })
      })

      it("should add new fields", async () => {
        const parserMock = new Mock<PageParser>()
          .setup((instance) => instance.parse(It.IsAny()))
          .returns(Promise.resolve(Some({ portal: "My portal" })))

        const parser = parserMock.object()

        const courseReference: CourseReference = {
          title: "This is a test title",
          completionDate: "2020-01-01",
          url: "https://www.pluralsight.com/courses/cryptography-big-picture"
        }

        const mergedDescriptor = await createMergedDescriptor(
          parser,
          courseReference
        )

        expect(mergedDescriptor).toEqual({
          ...courseReference,
          portal: "My portal"
        })
      })
    })
  })
})
