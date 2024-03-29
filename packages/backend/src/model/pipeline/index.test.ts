import { PacktParser } from "../pageParsing/concrete/PacktParser";
import { PluralsightParser } from "../pageParsing/concrete/PluralsightParser";
import { TedParser } from "../pageParsing/concrete/TedParser";
import { FailingPageParser } from "../pageParsing/FailingPageParser";
import { NopPageParser } from "../pageParsing/NopPageParser";
import { getCourseDescriptor } from ".";

describe("The pipeline for getting a course descriptor", () => {
  it("should return null on empty line", async () => {
    const actualDescriptor = await getCourseDescriptor(
      new FailingPageParser(),
      ""
    );

    expect(actualDescriptor).toEqual(null);
  });

  it("should return null on coment line", async () => {
    const actualDescriptor = await getCourseDescriptor(
      new FailingPageParser(),
      "//This is a comment"
    );

    expect(actualDescriptor).toEqual(null);
  });

  it("should return the course descriptor for a Pluralsight course", async () => {
    const url = "https://www.pluralsight.com/courses/cryptography-big-picture";

    const actualDescriptor = await getCourseDescriptor(
      new PluralsightParser(),
      `11/2: ${url}`
    );

    expect(actualDescriptor).toEqual({
      title: "Cryptography: The Big Picture",
      minutes: 84,
      url,
      completionDate: `${new Date().getFullYear()}-02-11`
    });
  });

  it("should return the course descriptor for a Packt course", async () => {
    const url =
      "https://www.packtpub.com/product/typescript-for-javascript-developers-video/9781838821876";

    const actualDescriptor = await getCourseDescriptor(
      new PacktParser(),
      `11/3: ${url}`
    );

    expect(actualDescriptor).toEqual({
      title: "TypeScript for JavaScript Developers",
      minutes: 174,
      url,
      completionDate: `${new Date().getFullYear()}-03-11`
    });
  });

  it("should return the course descriptor for a Ted talk", async () => {
    const url = "https://www.ted.com/talks/rory_stewart_why_democracy_matters";

    const actualDescriptor = await getCourseDescriptor(
      new TedParser(),
      `11/5: ${url}`
    );

    expect(actualDescriptor).toEqual({
      title: "Why democracy matters",
      minutes: 13,
      url,
      completionDate: `${new Date().getFullYear()}-05-11`
    });
  });

  it("should return the course descriptor when only title and minutes are provided", async () => {
    const actualDescriptor = await getCourseDescriptor(
      new FailingPageParser(),
      '11/6: "Introduction to Redux with TypeScript" #25h30'
    );

    expect(actualDescriptor).toEqual({
      title: "Introduction to Redux with TypeScript",
      minutes: 25 * 60 + 30,
      completionDate: `${new Date().getFullYear()}-06-11`
    });
  });

  it("should return the course descriptor when, title, minutes and unsupported url are provided", async () => {
    const actualDescriptor = await getCourseDescriptor(
      new NopPageParser(),
      '11/6: "Introduction to Redux with TypeScript" https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript #25h30'
    );

    expect(actualDescriptor).toEqual({
      title: "Introduction to Redux with TypeScript",
      minutes: 25 * 60 + 30,
      completionDate: `${new Date().getFullYear()}-06-11`,
      url: "https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript"
    });
  });
});
