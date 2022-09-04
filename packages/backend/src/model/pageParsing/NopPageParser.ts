import { CourseDescriptor } from "../shared/CourseDescriptor";
import { PageParser } from "./PageParser";

export class NopPageParser implements PageParser {
  parse(): Promise<Partial<CourseDescriptor> | null> {
    return Promise.resolve(null);
  }
}
