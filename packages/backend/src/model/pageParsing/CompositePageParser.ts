import { CourseDescriptor } from "../shared/CourseDescriptor";
import { PageParser } from "./PageParser";

export class CompositePageParser implements PageParser {
  private readonly subParsers: readonly PageParser[];

  constructor(...subParsers: readonly PageParser[]) {
    this.subParsers = subParsers;
  }

  async parse(url: URL): Promise<Partial<CourseDescriptor> | null> {
    for (const subParser of this.subParsers) {
      const subResult = await subParser.parse(url);
      if (subResult) {
        return subResult;
      }
    }

    return null;
  }
}
