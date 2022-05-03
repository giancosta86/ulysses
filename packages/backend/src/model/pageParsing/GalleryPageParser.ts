import { CompositePageParser } from "./CompositePageParser"
import { PluralsightParser } from "./concrete/PluralsightParser"
import { PacktParser } from "./concrete/PacktParser"
import { TedParser } from "./concrete/TedParser"

export class GalleryPageParser extends CompositePageParser {
  constructor() {
    super(new PluralsightParser(), new PacktParser(), new TedParser())
  }
}
