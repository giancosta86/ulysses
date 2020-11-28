import { RegexPageParser } from "../RegexPageParser"

export class UdemyParser extends RegexPageParser {
  constructor() {
    super("www.udemy.com", "udemy.com")
  }

  protected getTitleRegex(): RegExp {
    return /<h1[^>]*>([^<]+)<\/h1>/
  }

  protected getDurationRegex(): RegExp {
    return /\b(?<hours>[\d.]+)\s*h(?:ours?|rs?)\s*(?:(?<minutes>[\d.]+)\s*m)?/
  }
}
