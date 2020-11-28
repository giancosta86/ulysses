import { CourseDescriptor } from "./shared/CourseDescriptor"
import { CourseReificationError, reifyCourseDescriptor } from "./reification"

describe("Reification of a CourseDescriptor", () => {
  it("should be correct when all the fields are provided", () => {
    const partialDescriptor: Partial<CourseDescriptor> = {
      title: "The title",
      minutes: 90,
      url: "https://www.pluralsight.com/courses/cryptography-big-picture",
      portal: "The portal",
      completionDate: "2020-04-29",
      certificateUrl:
        "https://www.pluralsight.com/courses/cryptography-big-picture/certificate"
    }

    const courseDescriptor = reifyCourseDescriptor(partialDescriptor)

    expect(courseDescriptor).toEqual(partialDescriptor)
  })

  it("should be correct when just title and minutes are provided", () => {
    const partialDescriptor: Partial<CourseDescriptor> = {
      title: "The title",
      minutes: 90
    }

    const courseDescriptor = reifyCourseDescriptor(partialDescriptor)

    expect(courseDescriptor).toEqual(partialDescriptor)
  })

  it("should fail when title is missing", () => {
    const partialDescriptor: Partial<CourseDescriptor> = {
      minutes: 90,
      url: "https://www.pluralsight.com/courses/cryptography-big-picture",
      portal: "The portal",
      completionDate: "2020-04-29",
      certificateUrl:
        "https://www.pluralsight.com/courses/cryptography-big-picture/certificate"
    }

    expect(() => reifyCourseDescriptor(partialDescriptor)).toThrowError(
      CourseReificationError
    )
  })

  it("should fail when the minutes are missing", () => {
    const partialDescriptor: Partial<CourseDescriptor> = {
      title: "The title",
      url: "https://www.pluralsight.com/courses/cryptography-big-picture",
      portal: "The portal",
      completionDate: "2020-04-29",
      certificateUrl:
        "https://www.pluralsight.com/courses/cryptography-big-picture/certificate"
    }

    expect(() => reifyCourseDescriptor(partialDescriptor)).toThrowError(
      CourseReificationError
    )
  })

  it("should fail when the minutes are NaN", () => {
    const partialDescriptor: Partial<CourseDescriptor> = {
      title: "The title",
      minutes: NaN,
      url: "https://www.pluralsight.com/courses/cryptography-big-picture",
      portal: "The portal",
      completionDate: "2020-04-29",
      certificateUrl:
        "https://www.pluralsight.com/courses/cryptography-big-picture/certificate"
    }

    expect(() => reifyCourseDescriptor(partialDescriptor)).toThrowError(
      CourseReificationError
    )
  })
})
