import { CourseDescriptor } from "../shared/CourseDescriptor"

export interface PageParser {
  parse(url: URL): Promise<Partial<CourseDescriptor> | null>
}
