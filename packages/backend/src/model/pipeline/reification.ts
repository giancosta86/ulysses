import { CourseDescriptor } from "../shared/CourseDescriptor"

export class CourseReificationError extends Error {
  constructor(message?: string) {
    super(message)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export function reifyCourseDescriptor(
  partialDescriptor: Partial<CourseDescriptor>
): CourseDescriptor {
  if (partialDescriptor.title === undefined) {
    throw new CourseReificationError("'title' field is missing in descriptor")
  }

  if (partialDescriptor.minutes === undefined) {
    throw new CourseReificationError("'minutes' field is missing in descriptor")
  }

  if (isNaN(partialDescriptor.minutes)) {
    throw new CourseReificationError("'minutes' field is NaN in descriptor")
  }

  return {
    ...partialDescriptor
  } as CourseDescriptor
}
