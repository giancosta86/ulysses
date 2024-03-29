import { PacktParser } from "./PacktParser";

describe("Packt parser", () => {
  it("should not parse a page from a different domain", async () => {
    const parser = new PacktParser();

    const actualParsingResult = await parser.parse(
      new URL("https://gianlucacosta.info/test")
    );

    expect(actualParsingResult).toEqual(null);
  });

  it("should parse a course whose duration has both hours and minutes", async () => {
    const parser = new PacktParser();

    const actualParsingResult = await parser.parse(
      new URL(
        "https://www.packtpub.com/product/typescript-for-javascript-developers-video/9781838821876"
      )
    );

    expect(actualParsingResult).toEqual({
      title: "TypeScript for JavaScript Developers",
      minutes: 2 * 60 + 54,
      url: "https://www.packtpub.com/product/typescript-for-javascript-developers-video/9781838821876"
    });
  });

  it("should parse a course whose duration is between 1 hour and 2 hours", async () => {
    const parser = new PacktParser();

    const actualParsingResult = await parser.parse(
      new URL(
        "https://www.packtpub.com/product/beginning-devops-with-docker-elearning/9781789344509"
      )
    );

    expect(actualParsingResult).toEqual({
      title: "Beginning DevOps with Docker",
      minutes: 60 + 10,
      url: "https://www.packtpub.com/product/beginning-devops-with-docker-elearning/9781789344509"
    });
  });

  it("should parse a course whose duration is more than 10 hours", async () => {
    const parser = new PacktParser();

    const actualParsingResult = await parser.parse(
      new URL(
        "https://www.packtpub.com/product/learn-to-code-with-ruby-video/9781788834063"
      )
    );

    expect(actualParsingResult).toEqual({
      title: "Learn to Code with Ruby",
      minutes: 31 * 60 + 27,
      url: "https://www.packtpub.com/product/learn-to-code-with-ruby-video/9781788834063"
    });
  });

  it("should parse a course whose duration is precisely 1 hour", async () => {
    const parser = new PacktParser();

    const actualParsingResult = await parser.parse(
      new URL(
        "https://www.packtpub.com/product/a-quick-introduction-to-javascript-json-video/9781800569027"
      )
    );

    expect(actualParsingResult).toEqual({
      title:
        "Create Dynamic and Interactive Web Content Using AJAX and JSON in JavaScript",
      minutes: 322,
      url: "https://www.packtpub.com/product/a-quick-introduction-to-javascript-json-video/9781800569027"
    });
  });

  it("should parse a book, skipping the duration", async () => {
    const parser = new PacktParser();

    const actualParsingResult = await parser.parse(
      new URL(
        "https://www.packtpub.com/product/c-9-and-net-5-modern-cross-platform-development-fifth-edition/9781800568105"
      )
    );

    expect(actualParsingResult).toEqual({
      title:
        "C# 9 and .NET 5 – Modern Cross-Platform Development - Fifth Edition",
      url: "https://www.packtpub.com/product/c-9-and-net-5-modern-cross-platform-development-fifth-edition/9781800568105"
    });
  });
});
