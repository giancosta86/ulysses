import { Optional, None, Some } from "optional-typescript"
import { MultipartPageParser } from "./MultipartPageParser"

function extractSingleGroup(regex: RegExp, source: string): Optional<string> {
  const match = regex.exec(source)
  if (!match || match.length != 2) {
    return None()
  }

  return Some(match[1])
}

export abstract class RegexPageParser extends MultipartPageParser {
  protected getTitle(pageText: string): Optional<string> {
    return extractSingleGroup(this.getTitleRegex(), pageText)
  }

  protected abstract getTitleRegex(): RegExp

  protected getMinutes(pageText: string): Optional<number> {
    const match = this.getDurationRegex().exec(pageText)

    if (!match || !match.groups) {
      return None()
    }

    const hours = parseFloat(match.groups.hours ?? "0")
    const minutes = parseInt(match.groups.minutes ?? "0")
    const seconds = parseInt(match.groups.seconds ?? "0")

    const totalMinutes = hours * 60 + minutes + seconds / 60

    return !isNaN(totalMinutes) ? Some(Math.round(totalMinutes)) : None()
  }

  protected abstract getDurationRegex(): RegExp

  protected getUrl(pageText: string): Optional<string> {
    const urlRegex = this.getUrlRegex()
    if (urlRegex.hasValue) {
      return extractSingleGroup(urlRegex.valueOrFailure(), pageText)
    }

    return None()
  }

  protected getUrlRegex(): Optional<RegExp> {
    return Some(/<link\s+rel="canonical"\s+href="([^"]+)"/)
  }
}
