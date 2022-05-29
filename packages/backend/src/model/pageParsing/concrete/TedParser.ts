import { RegexPageParser } from "../RegexPageParser";

export class TedParser extends RegexPageParser {
  constructor() {
    super("www.ted.com", "ted.com");
  }

  protected getTitleRegex(): RegExp {
    return /<meta\s+property\s*=\s*"og:title"\s+content\s*=\s*"([^"]+)"\s*\/>/;
  }

  protected getDurationRegex(): RegExp {
    return /<meta\s+property\s*=\s*"og:video:duration"\s+content\s*=\s*"(?<seconds>\d+)"\s*\/>/;
  }
}
