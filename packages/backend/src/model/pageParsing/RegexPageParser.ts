import { MultipartPageParser } from "./MultipartPageParser";

function extractSingleGroup(regex: RegExp, source: string): string | null {
  const match = regex.exec(source);
  if (!match || match.length != 2) {
    return null;
  }

  return match[1] ?? null;
}

export abstract class RegexPageParser extends MultipartPageParser {
  protected getTitle(pageText: string): string | null {
    return extractSingleGroup(this.getTitleRegex(), pageText);
  }

  protected abstract getTitleRegex(): RegExp;

  protected getMinutes(pageText: string): number | null {
    const match = this.getDurationRegex().exec(pageText);

    if (!match || !match.groups) {
      return null;
    }

    const hours = parseFloat(match.groups["hours"] ?? "0");
    const minutes = parseInt(match.groups["minutes"] ?? "0");
    const seconds = parseInt(match.groups["seconds"] ?? "0");

    const totalMinutes = hours * 60 + minutes + seconds / 60;

    return !isNaN(totalMinutes) ? Math.round(totalMinutes) : null;
  }

  protected abstract getDurationRegex(): RegExp;

  protected getUrl(pageText: string): string | null {
    const urlRegex = this.getUrlRegex();
    if (urlRegex) {
      return extractSingleGroup(urlRegex, pageText);
    }

    return null;
  }

  protected getUrlRegex(): RegExp | null {
    return /<link\s+rel="canonical"\s+href="([^"]+)"/;
  }
}
