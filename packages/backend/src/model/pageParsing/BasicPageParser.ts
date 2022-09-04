import fetch from "cross-fetch";
import { CourseDescriptor } from "../shared/CourseDescriptor";
import { PageParser } from "./PageParser";

export abstract class BasicPageParser implements PageParser {
  private readonly acceptedHosts: readonly string[];

  constructor(...acceptedHosts: string[]) {
    this.acceptedHosts = acceptedHosts;
  }

  parse(url: URL): Promise<Partial<CourseDescriptor> | null> {
    return (async () => {
      if (!this.acceptedHosts.includes(url.host)) {
        return null;
      }

      const response = await fetch(url.toString());

      const pageText = await response.text();

      return this.parseText(pageText);
    })();
  }

  protected abstract parseText(
    pageText: string
  ): Promise<Partial<CourseDescriptor> | null>;
}
