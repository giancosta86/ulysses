import { None, Some } from "optional-typescript"
import { PacktParser } from "./pageParsing/concrete/PacktParser"
import { PluralsightParser } from "./pageParsing/concrete/PluralsightParser"
import { TedParser } from "./pageParsing/concrete/TedParser"
import { UdemyParser } from "./pageParsing/concrete/UdemyParser"
import { FailingPageParser } from "./pageParsing/FailingPageParser"
import { NopPageParser } from "./pageParsing/NopPageParser"
import { getCourseDescriptor } from "./pipeline"

describe("The pipeline for getting a course descriptor", () => {
  it("should return None on empty line", async () => {
    const actualDescriptor = await getCourseDescriptor(
      new FailingPageParser(),
      ""
    )

    expect(actualDescriptor).toEqual(None())
  })

  it("should return None on coment line", async () => {
    const actualDescriptor = await getCourseDescriptor(
      new FailingPageParser(),
      "//This is a comment"
    )

    expect(actualDescriptor).toEqual(None())
  })

  it("should return the course descriptor for a Pluralsight course", async () => {
    const url = "https://www.pluralsight.com/courses/cryptography-big-picture"

    const actualDescriptor = await getCourseDescriptor(
      new PluralsightParser(),
      `11/2: ${url}`
    )

    expect(actualDescriptor).toEqual(
      Some({
        title: "Cryptography: The Big Picture",
        minutes: 84,
        url,
        completionDate: `${new Date().getFullYear()}-02-11`
      })
    )
  })

  it("should return the course descriptor for a Packt course", async () => {
    const url =
      "https://www.packtpub.com/product/typescript-for-javascript-developers-video/9781838821876"

    const actualDescriptor = await getCourseDescriptor(
      new PacktParser(),
      `11/3: ${url}`
    )

    expect(actualDescriptor).toEqual(
      Some({
        title: "TypeScript for JavaScript Developers",
        minutes: 174,
        url,
        completionDate: `${new Date().getFullYear()}-03-11`
      })
    )
  })

  it("should return the course descriptor for a Udemy course", async () => {
    const url = "https://www.udemy.com/course/understanding-typescript/"

    const actualDescriptor = await getCourseDescriptor(
      new UdemyParser(),
      `11/4: ${url}`
    )

    expect(actualDescriptor).toEqual(
      Some({
        title: "Understanding TypeScript - 2020 Edition",
        minutes: 15 * 60,
        url,
        completionDate: `${new Date().getFullYear()}-04-11`
      })
    )
  })

  it("should return the course descriptor for a Ted talk", async () => {
    const url = "https://www.ted.com/talks/rory_stewart_why_democracy_matters"

    const actualDescriptor = await getCourseDescriptor(
      new TedParser(),
      `11/5: ${url}`
    )

    expect(actualDescriptor).toEqual(
      Some({
        title: "Why democracy matters",
        minutes: 14,
        url,
        completionDate: `${new Date().getFullYear()}-05-11`
      })
    )
  })

  it("should return the course descriptor when only title and minutes are provided", async () => {
    const actualDescriptor = await getCourseDescriptor(
      new FailingPageParser(),
      '11/6: "Introduction to Redux with TypeScript" #25h30'
    )

    expect(actualDescriptor).toEqual(
      Some({
        title: "Introduction to Redux with TypeScript",
        minutes: 25 * 60 + 30,
        completionDate: `${new Date().getFullYear()}-06-11`
      })
    )
  })

  it("should return the course descriptor when, title, minutes and unsupported url are provided", async () => {
    const actualDescriptor = await getCourseDescriptor(
      new NopPageParser(),
      '11/6: "Introduction to Redux with TypeScript" https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript #25h30'
    )

    expect(actualDescriptor).toEqual(
      Some({
        title: "Introduction to Redux with TypeScript",
        minutes: 25 * 60 + 30,
        completionDate: `${new Date().getFullYear()}-06-11`,
        url:
          "https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript"
      })
    )
  })
})
