import { CourseReference } from "./referenceParsing"
import { CourseDescriptor } from "./shared/CourseDescriptor"
import { PageParser } from "./pageParsing/PageParser"

export function createMergedDescriptor(
  pageParser: PageParser,
  courseReference: CourseReference
): Promise<Partial<CourseDescriptor>> {
  return (async () => {
    const initialResult: Partial<CourseDescriptor> = {
      ...courseReference
    }

    if (!courseReference.url) {
      return initialResult
    }

    const url = new URL(courseReference.url)
    const parsingResult = (await pageParser.parse(url)).valueOr({})

    const actualResult = {
      ...initialResult,
      ...parsingResult
    }

    return actualResult
  })()
}
