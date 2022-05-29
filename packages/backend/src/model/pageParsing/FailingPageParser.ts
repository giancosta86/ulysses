import { CourseDescriptor } from "../shared/CourseDescriptor";
import { PageParser } from "./PageParser";

export class FailingPageParser implements PageParser {
  parse(url: URL): Promise<Partial<CourseDescriptor> | null> {
    throw new Error(
      "Calling this method is the consequence of some design error in the workflow"
    );
  }
}
