import { None, Optional, Some } from "optional-typescript"
import { parseCourseReference } from "./referenceParsing"
import { reifyCourseDescriptor } from "./reification"
import { CourseDescriptor } from "./shared/CourseDescriptor"
import { createMergedDescriptor } from "./mergedDescriptors"
import { PageParser } from "./pageParsing/PageParser"

export async function getCourseDescriptor(
  parser: PageParser,
  line: string
): Promise<Optional<CourseDescriptor>> {
  const courseReference = parseCourseReference(line)
  if (!courseReference.hasValue) {
    return Promise.resolve(None())
  }

  const mergedDescriptor = await createMergedDescriptor(
    parser,
    courseReference.valueOrFailure()
  )

  const reifiedCourse = reifyCourseDescriptor(mergedDescriptor)

  return Some(reifiedCourse)
}
