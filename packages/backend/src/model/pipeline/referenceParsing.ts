const referenceLineRegex =
  /(?:(?:(?<day>\d{1,2})\s*\/\s*(?<month>\d{1,2})(?:\/(?<year>\d{4}))?)|(?<in_progress>\*))\s*:\s*(?:"(?<title>[^"]+)"(?:\s+|$))?(?:(?<url>[^#\s]+)(?:\s+|$))?(?:#(?<hours>\d+)h(?<minutes>\d+))?/;

export interface CourseReference {
  completionDate?: string;
  title?: string;
  url?: string;
  minutes?: number;
}

export class CourseReferenceParsingError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function parseCourseReference(line: string): CourseReference | null {
  const actualLine = line.trim();

  if (actualLine == "" || actualLine.startsWith("//")) {
    return null;
  }

  const match = referenceLineRegex.exec(actualLine);
  if (match === null || match.groups === undefined) {
    throw new CourseReferenceParsingError(
      "Line does not match the required format"
    );
  }

  const isoDate = parseIsoDate(match.groups);

  const url = match.groups.url;
  const title = match.groups.title;

  const hours = parseInt(match.groups.hours);
  const minutes = parseInt(match.groups.minutes);
  const totalMinutes = hours * 60 + minutes;

  return {
    completionDate: isoDate,
    title,
    url,
    minutes: !isNaN(totalMinutes) ? totalMinutes : undefined
  };
}

function parseIsoDate(groups: { [key: string]: string }): string | undefined {
  if (groups.in_progress) {
    return;
  }

  const day = parseInt(groups.day);
  const formattedDay = day.toString().padStart(2, "0");

  const month = parseInt(groups.month);
  const formattedMonth = month.toString().padStart(2, "0");

  const year = groups.year ? parseInt(groups.year) : new Date().getFullYear();

  const isoDate = `${year}-${formattedMonth}-${formattedDay}`;

  const testCompletionDate = new Date(isoDate);

  if (isNaN(testCompletionDate.getDate())) {
    throw new CourseReferenceParsingError(
      `Invalid completion date: '${isoDate}'`
    );
  }

  return isoDate;
}
