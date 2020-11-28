import { Optional, None } from "optional-typescript"
import { CourseDescriptor } from "../shared/CourseDescriptor"
import { PageParser } from "./PageParser"
import fetch from "cross-fetch"

export abstract class BasicPageParser implements PageParser {
  private readonly acceptedHosts: readonly string[]

  constructor(...acceptedHosts: string[]) {
    this.acceptedHosts = acceptedHosts
  }

  parse(url: URL): Promise<Optional<Partial<CourseDescriptor>>> {
    return (async () => {
      if (!this.acceptedHosts.includes(url.host)) {
        return None<Partial<CourseDescriptor>>()
      }

      const response = await fetch(url.toString())

      const pageText = await response.text()

      return this.parseText(pageText)
    })()
  }

  protected abstract parseText(
    pageText: string
  ): Promise<Optional<Partial<CourseDescriptor>>>
}
