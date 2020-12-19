import { RegexPageParser } from "../RegexPageParser"

export class PacktParser extends RegexPageParser {
  constructor() {
    super("www.packtpub.com", "packtpub.com")
  }

  protected getTitleRegex(): RegExp {
    return /<meta\s+property\s*=\s*"og:title"\s+content\s*=\s*"([^["]+?)\s*(?:"|\[|\|)/
  }

  protected getDurationRegex(): RegExp {
    return /(?:(?<hours>\d+)\s*hours?\s+)?(?:(?<minutes>\d+)\s*minutes?)/
  }
}
