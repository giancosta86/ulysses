import { None, Some } from "optional-typescript"
import { UdemyParser } from "./UdemyParser"

describe("Udemy parser", () => {
  it("should not parse a page from a different domain", async () => {
    const parser = new UdemyParser()

    const actualParsingResult = await parser.parse(
      new URL("https://gianlucacosta.info/test")
    )

    expect(actualParsingResult).toEqual(None())
  })

  it("should parse a course whose duration has just hours", async () => {
    const parser = new UdemyParser()

    const actualParsingResult = await parser.parse(
      new URL("https://www.udemy.com/course/understanding-typescript/")
    )

    const actualDescriptor = actualParsingResult.valueOrFailure()

    expect(actualDescriptor.title).toMatch(
      /Understanding TypeScript - \d{4} Edition/
    )
    expect(actualDescriptor.url).toEqual(
      "https://www.udemy.com/course/understanding-typescript/"
    )
    expect(actualDescriptor.minutes).toEqual(15 * 60)
  })

  it("should parse a course whose duration has floating-point hours", async () => {
    const parser = new UdemyParser()

    const actualParsingResult = await parser.parse(
      new URL(
        "https://www.udemy.com/course/angular-essentials-angular-2-angular-4-with-typescript/"
      )
    )

    expect(actualParsingResult).toEqual(
      Some({
        title: "Angular Essentials (Angular 2+ with TypeScript)",
        minutes: 6.5 * 60,
        url:
          "https://www.udemy.com/course/angular-essentials-angular-2-angular-4-with-typescript/"
      })
    )
  })
})
