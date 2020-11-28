import { RegexPageParser } from "../RegexPageParser"

export class PluralsightParser extends RegexPageParser {
  constructor() {
    super("www.pluralsight.com", "pluralsight.com")
  }

  protected getTitleRegex(): RegExp {
    return /<meta\s+property\s*=\s*"og:title"\s+content="([^"]+)"\s*\/>/
  }

  protected getDurationRegex(): RegExp {
    return /<meta\s+name="duration"\s+content\s*=\s*"PT(?:(?<hours>\d+)H)?(?:(?<minutes>\d+)M)?/
  }
}
