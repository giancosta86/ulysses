const referenceLineRegex =
  /(?<day>\d{1,2})\s*\/\s*(?<month>\d{1,2})(?:\/(?<year>\d{4}))?\s*:\s*(?:"(?<title>[^"]+)"(?:\s+|$))?(?:(?<url>[^#\s]+)(?:\s+|$))?(?:#(?<hours>\d+)h(?<minutes>\d+))?/;

export interface CourseReference {
  completionDate: string;
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

  const day = parseInt(match.groups.day);
  const formattedDay = day.toString().padStart(2, "0");

  const month = parseInt(match.groups.month);
  const formattedMonth = month.toString().padStart(2, "0");

  const year = match.groups.year
    ? parseInt(match.groups.year)
    : new Date().getFullYear();

  const formattedCompletionDate = `${year}-${formattedMonth}-${formattedDay}`;

  const testCompletionDate = new Date(formattedCompletionDate);

  if (isNaN(testCompletionDate.getDate())) {
    throw new CourseReferenceParsingError(
      `Invalid completion date: '${formattedCompletionDate}'`
    );
  }

  const url = match.groups.url;
  const title = match.groups.title;

  const hours = parseInt(match.groups.hours);
  const minutes = parseInt(match.groups.minutes);
  const totalMinutes = hours * 60 + minutes;

  return {
    completionDate: formattedCompletionDate,
    title,
    url,
    minutes: !isNaN(totalMinutes) ? totalMinutes : undefined
  };
}
