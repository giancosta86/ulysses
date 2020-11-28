import * as he from "he"
import { Optional, Some, None } from "optional-typescript"
import { CourseDescriptor } from "../shared/CourseDescriptor"
import { BasicPageParser } from "./BasicPageParser"

export abstract class MultipartPageParser extends BasicPageParser {
  protected parseText(
    pageText: string
  ): Promise<Optional<Partial<CourseDescriptor>>> {
    return (async () => {
      const parsedResult: Partial<CourseDescriptor> = {}

      const title = this.getTitle(pageText)
      if (title.hasValue) {
        parsedResult.title = he.decode(title.valueOrFailure().trim())
      }

      const minutes = this.getMinutes(pageText)
      if (minutes.hasValue && !isNaN(minutes.valueOrFailure())) {
        parsedResult.minutes = minutes.valueOrFailure()
      }

      const portal = this.getPortal(pageText)
      if (portal.hasValue) {
        parsedResult.portal = he.decode(portal.valueOrFailure().trim())
      }

      const certificateUrl = this.getCertificateUrl(pageText)
      if (certificateUrl.hasValue) {
        parsedResult.certificateUrl = certificateUrl.valueOrFailure().trim()
      }

      const url = this.getUrl(pageText)
      if (url.hasValue) {
        parsedResult.url = url.valueOrFailure().trim()
      }

      return Some(parsedResult)
    })()
  }

  protected abstract getTitle(pageText: string): Optional<string>

  protected abstract getMinutes(pageText: string): Optional<number>

  protected getPortal(pageText: string): Optional<string> {
    return None()
  }

  protected getCertificateUrl(pageText: string): Optional<string> {
    return None()
  }

  protected abstract getUrl(pageText: string): Optional<string>
}
