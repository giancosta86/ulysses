import { None, Some } from "optional-typescript"
import { PluralsightParser } from "./PluralsightParser"

describe("Pluralsight parser", () => {
  it("should not parse a page from a different domain", async () => {
    const parser = new PluralsightParser()

    const actualParsingResult = await parser.parse(
      new URL("https://gianlucacosta.info/test")
    )

    expect(actualParsingResult).toEqual(None())
  })

  it("should parse a course whose duration includes both hours and minutes", async () => {
    const parser = new PluralsightParser()

    const actualParsingResult = await parser.parse(
      new URL("https://www.pluralsight.com/courses/cryptography-big-picture")
    )

    expect(actualParsingResult).toEqual(
      Some({
        title: "Cryptography: The Big Picture",
        minutes: 84,
        url: "https://www.pluralsight.com/courses/cryptography-big-picture"
      })
    )
  })

  it("should parse a course whose duration is less than an hour", async () => {
    const parser = new PluralsightParser()

    const actualParsingResult = await parser.parse(
      new URL("https://www.pluralsight.com/courses/typescript-big-picture")
    )

    expect(actualParsingResult).toEqual(
      Some({
        title: "TypeScript: The Big Picture",
        minutes: 44,
        url: "https://www.pluralsight.com/courses/typescript-big-picture"
      })
    )
  })
})
