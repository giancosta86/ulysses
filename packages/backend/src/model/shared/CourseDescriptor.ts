export interface CourseDescriptor {
  title: string;
  minutes: number;
  url?: string;
  portal?: string;
  completionDate?: string;
  certificateUrl?: string;
}

export function isCourseDescriptor(
  instance: any
): instance is CourseDescriptor {
  return "title" in instance && "minutes" in instance;
}
