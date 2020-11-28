import { Optional } from "optional-typescript"
import { CourseDescriptor } from "../shared/CourseDescriptor"

export interface PageParser {
  parse(url: URL): Promise<Optional<Partial<CourseDescriptor>>>
}
