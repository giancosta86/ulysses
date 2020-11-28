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

    expect(actualParsingResult).toEqual(
      Some({
        title: "Understanding TypeScript - 2020 Edition",
        minutes: 15 * 60,
        url: "https://www.udemy.com/course/understanding-typescript/"
      })
    )
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

  it("should parse a course whose duration has hours and minutes", async () => {
    const parser = new UdemyParser()

    const actualParsingResult = await parser.parse(
      new URL("https://www.udemy.com/course/learn-webpack-2-from-scratch/")
    )

    expect(actualParsingResult).toEqual(
      Some({
        title: "Learn Webpack 2 from scratch",
        minutes: 60 + 16,
        url: "https://www.udemy.com/course/learn-webpack-2-from-scratch/"
      })
    )
  })

  it("should handle courses whose displayed duration differs from the metadata", async () => {
    const parser = new UdemyParser()

    const actualParsingResult = await parser.parse(
      new URL("https://www.udemy.com/course/webpack-5-fundamentals")
    )

    expect(actualParsingResult).toEqual(
      Some({
        title: "Webpack 5 Fundamentals",
        minutes: 60 + 8, //But the UI shows 1hr 25min!
        url: "https://www.udemy.com/course/webpack-5-fundamentals/"
      })
    )
  })
})
