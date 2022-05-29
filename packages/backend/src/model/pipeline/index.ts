import { parseCourseReference } from "./referenceParsing";
import { reifyCourseDescriptor } from "./reification";
import { CourseDescriptor } from "../shared/CourseDescriptor";
import { createMergedDescriptor } from "./mergedDescriptors";
import { PageParser } from "../pageParsing/PageParser";

export async function getCourseDescriptor(
  parser: PageParser,
  line: string
): Promise<CourseDescriptor | null> {
  const courseReference = parseCourseReference(line);
  if (!courseReference) {
    return Promise.resolve(null);
  }

  const mergedDescriptor = await createMergedDescriptor(
    parser,
    courseReference
  );

  const reifiedCourse = reifyCourseDescriptor(mergedDescriptor);

  return reifiedCourse;
}
