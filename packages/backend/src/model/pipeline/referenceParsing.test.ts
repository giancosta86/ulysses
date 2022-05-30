import {
  parseCourseReference,
  CourseReference,
  CourseReferenceParsingError
} from "./referenceParsing";

describe("Parsing course references", () => {
  it("should parse a reference having just one-digit day and month, plus url", () => {
    const actualReference = parseCourseReference(
      "8/9: https://www.pluralsight.com/courses/cryptography-big-picture"
    );

    const expectedReference: CourseReference = {
      completionDate: `${new Date().getFullYear()}-09-08`,
      url: "https://www.pluralsight.com/courses/cryptography-big-picture"
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should parse a reference having just one-digit day and month, plus url and kind", () => {
    const actualReference = parseCourseReference(
      '8/9: https://www.pluralsight.com/courses/cryptography-big-picture !"Course"'
    );

    const expectedReference: CourseReference = {
      completionDate: `${new Date().getFullYear()}-09-08`,
      url: "https://www.pluralsight.com/courses/cryptography-big-picture",
      kind: "Course"
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should parse a reference having just mixed-length-digit day and month, plus url", () => {
    const actualReference = parseCourseReference(
      "4/10: https://www.pluralsight.com/courses/c-sharp-design-patterns-data-access-patterns"
    );

    const expectedReference: CourseReference = {
      completionDate: `${new Date().getFullYear()}-10-04`,
      url: "https://www.pluralsight.com/courses/c-sharp-design-patterns-data-access-patterns"
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should parse an in-progress reference having just the URL", () => {
    const actualReference = parseCourseReference(
      "*: https://www.pluralsight.com/courses/cryptography-big-picture"
    );

    const expectedReference: CourseReference = {
      url: "https://www.pluralsight.com/courses/cryptography-big-picture"
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should parse a reference having full, mixed date, plus url", () => {
    const actualReference = parseCourseReference(
      "4/10/2020: https://www.pluralsight.com/courses/c-sharp-design-patterns-data-access-patterns"
    );

    const expectedReference: CourseReference = {
      completionDate: `2020-10-04`,
      url: "https://www.pluralsight.com/courses/c-sharp-design-patterns-data-access-patterns"
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should parse a reference having date, title, and url", () => {
    const actualReference = parseCourseReference(
      '23/10: "Introduction to Redux with TypeScript" https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript'
    );

    const expectedReference: CourseReference = {
      title: "Introduction to Redux with TypeScript",
      completionDate: `${new Date().getFullYear()}-10-23`,
      url: "https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript"
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should parse a reference having date, title, url and kind", () => {
    const actualReference = parseCourseReference(
      '23/10: "Introduction to Redux with TypeScript" https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript !"Course"'
    );

    const expectedReference: CourseReference = {
      title: "Introduction to Redux with TypeScript",
      completionDate: `${new Date().getFullYear()}-10-23`,
      url: "https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript",
      kind: "Course"
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should parse a reference having date, title, url and learning time", () => {
    const actualReference = parseCourseReference(
      '23/10: "Introduction to Redux with TypeScript" https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript #25h30'
    );

    const expectedReference: CourseReference = {
      title: "Introduction to Redux with TypeScript",
      completionDate: `${new Date().getFullYear()}-10-23`,
      url: "https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript",
      minutes: 25 * 60 + 30
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should parse a reference having date, title, url, kind and learning time", () => {
    const actualReference = parseCourseReference(
      '23/10: "Introduction to Redux with TypeScript" https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript !"Slides" #25h30'
    );

    const expectedReference: CourseReference = {
      title: "Introduction to Redux with TypeScript",
      completionDate: `${new Date().getFullYear()}-10-23`,
      url: "https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript",
      minutes: 25 * 60 + 30,
      kind: "Slides"
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should parse an in-progress reference having title, url and learning time", () => {
    const actualReference = parseCourseReference(
      '*: "Introduction to Redux with TypeScript" https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript #25h30'
    );

    const expectedReference: CourseReference = {
      title: "Introduction to Redux with TypeScript",
      url: "https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript",
      minutes: 25 * 60 + 30
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should parse an in-progress reference having title, url, kind and learning time", () => {
    const actualReference = parseCourseReference(
      '*: "Introduction to Redux with TypeScript" https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript !"Slides" #25h30'
    );

    const expectedReference: CourseReference = {
      title: "Introduction to Redux with TypeScript",
      url: "https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript",
      minutes: 25 * 60 + 30,
      kind: "Slides"
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should parse a reference having date, url and learning time", () => {
    const actualReference = parseCourseReference(
      "23/10: https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript #25h30"
    );

    const expectedReference: CourseReference = {
      completionDate: `${new Date().getFullYear()}-10-23`,
      url: "https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript",
      minutes: 25 * 60 + 30
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should parse a reference having date, title and learning time, but not url", () => {
    const actualReference = parseCourseReference(
      '17/8: "General Data Protection Regulation (GDPR) 2019" #0h50'
    );

    const expectedReference: CourseReference = {
      completionDate: `${new Date().getFullYear()}-08-17`,
      title: "General Data Protection Regulation (GDPR) 2019",
      minutes: 50
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should ignore leading and trailing spaces", () => {
    const actualReference = parseCourseReference(
      ' \t   23/10: "Introduction to Redux with TypeScript" https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript #25h30                     '
    );

    const expectedReference: CourseReference = {
      completionDate: `${new Date().getFullYear()}-10-23`,
      title: "Introduction to Redux with TypeScript",
      url: "https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript",
      minutes: 25 * 60 + 30
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should ignore comment lines", () => {
    const actualReference = parseCourseReference("//Comment line");

    expect(actualReference).toEqual(null);
  });

  it("should ignore comment lines with leading and trailing spaces", () => {
    const actualReference = parseCourseReference(
      "    \t   //Comment line  \t "
    );

    expect(actualReference).toEqual(null);
  });

  it("should ignore intermediate spaces", () => {
    const actualReference = parseCourseReference(
      '23   /  10    :      "Introduction to Redux with TypeScript"  \t  https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript       #25h30'
    );

    const expectedReference: CourseReference = {
      completionDate: `${new Date().getFullYear()}-10-23`,
      title: "Introduction to Redux with TypeScript",
      url: "https://speakerdeck.com/giancosta86/introduction-to-redux-with-typescript",
      minutes: 25 * 60 + 30
    };

    expect(actualReference).toEqual(expectedReference);
  });

  it("should ignore empty lines", () => {
    const actualReference = parseCourseReference("");

    expect(actualReference).toEqual(null);
  });

  it("should ignore lines made of spaces", () => {
    const actualReference = parseCourseReference("  \t ");

    expect(actualReference).toEqual(null);
  });

  it("should fail when the line format is unexpected", () => {
    expect(() => {
      parseCourseReference("Dodo");
    }).toThrow(CourseReferenceParsingError);
  });

  it("should fail when the date is invalid", () => {
    expect(() => {
      parseCourseReference(
        "8/17: https://www.pluralsight.com/courses/cryptography-big-picture"
      );
    }).toThrow(CourseReferenceParsingError);
  });
});
