import * as he from "he";
import { CourseDescriptor } from "../shared/CourseDescriptor";
import { BasicPageParser } from "./BasicPageParser";

export abstract class MultipartPageParser extends BasicPageParser {
  protected parseText(
    pageText: string
  ): Promise<Partial<CourseDescriptor> | null> {
    return (async () => {
      const parsedResult: Partial<CourseDescriptor> = {};

      const title = this.getTitle(pageText);
      if (title) {
        parsedResult.title = he.decode(title.trim());
      }

      const minutes = this.getMinutes(pageText);
      if (minutes && !isNaN(minutes)) {
        parsedResult.minutes = minutes;
      }

      const portal = this.getPortal();
      if (portal) {
        parsedResult.portal = he.decode(portal.trim());
      }

      const certificateUrl = this.getCertificateUrl();
      if (certificateUrl) {
        parsedResult.certificateUrl = certificateUrl.trim();
      }

      const url = this.getUrl(pageText);
      if (url) {
        parsedResult.url = url.trim();
      }

      return parsedResult;
    })();
  }

  protected abstract getTitle(pageText: string): string | null;

  protected abstract getMinutes(pageText: string): number | null;

  protected getPortal(): string | null {
    return null;
  }

  protected getCertificateUrl(): string | null {
    return null;
  }

  protected abstract getUrl(pageText: string): string | null;
}
