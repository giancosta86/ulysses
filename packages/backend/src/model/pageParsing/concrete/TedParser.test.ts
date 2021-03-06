import { None, Some } from "optional-typescript"
import { TedParser } from "./TedParser"

describe("Ted parser", () => {
  it("should not parse a page from a different domain", async () => {
    const parser = new TedParser()

    const actualParsingResult = await parser.parse(
      new URL("https://gianlucacosta.info/test")
    )

    expect(actualParsingResult).toEqual(None())
  })

  it("should parse a talk whose duration is less than 10 minutes", async () => {
    const parser = new TedParser()

    const actualParsingResult = await parser.parse(
      new URL(
        "https://www.ted.com/talks/chris_anderson_ted_s_secret_to_great_public_speaking"
      )
    )

    expect(actualParsingResult).toEqual(
      Some({
        title: "TED's secret to great public speaking",
        minutes: 8,
        url:
          "https://www.ted.com/talks/chris_anderson_ted_s_secret_to_great_public_speaking"
      })
    )
  })

  it("should parse a talk whose duration is more than 10 minutes", async () => {
    const parser = new TedParser()

    const actualParsingResult = await parser.parse(
      new URL("https://www.ted.com/talks/rory_stewart_why_democracy_matters")
    )

    expect(actualParsingResult).toEqual(
      Some({
        title: "Why democracy matters",
        minutes: 14,
        url: "https://www.ted.com/talks/rory_stewart_why_democracy_matters"
      })
    )
  })
})
