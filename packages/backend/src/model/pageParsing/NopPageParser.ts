import { Optional, None } from "optional-typescript"
import { CourseDescriptor } from "../shared/CourseDescriptor"
import { PageParser } from "./PageParser"

export class NopPageParser implements PageParser {
  parse(url: URL): Promise<Optional<Partial<CourseDescriptor>>> {
    return Promise.resolve(None())
  }
}
