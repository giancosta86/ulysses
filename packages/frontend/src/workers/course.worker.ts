import {
  CourseDescriptor,
  isCourseDescriptor
} from "@BackendModel/CourseDescriptor"
import { LineError, isLineError } from "@BackendModel/LineError"
import { BoxedSocket } from "./BoxedSocket"

export interface CourseWorkerResult {
  courseDescriptors: readonly CourseDescriptor[]
  lineErrors: readonly LineError[]
}

let canceled = false

export async function getDescriptors(
  backendPort: number,
  inputText: string,
  onActualInputLinesCounted: (actualInputLinesCount: number) => void,
  onLineProcessed: (processedLinesCount: number) => void,
  onCompletion: (courseWorkerResult: CourseWorkerResult) => void
): Promise<void> {
  const boxedSocket = new BoxedSocket(backendPort)

  try {
    const actualInputLines = inputText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("//"))

    onActualInputLinesCounted(actualInputLines.length)

    const courseDescriptors = [] as CourseDescriptor[]
    const lineErrors = [] as LineError[]

    let processedLinesCount = 0

    for (let line of actualInputLines) {
      if (canceled) {
        break
      }

      const lineResult = await boxedSocket.getLineResult(line)

      if (canceled) {
        break
      }

      if (isCourseDescriptor(lineResult)) {
        courseDescriptors.push(lineResult)
      } else if (isLineError(lineResult)) {
        lineErrors.push(lineResult)
      } else {
        throw new Error(`Unknown line result: ${JSON.stringify(lineResult)}`)
      }

      processedLinesCount++
      onLineProcessed(processedLinesCount)
    }

    if (!canceled) {
      onCompletion({
        courseDescriptors,
        lineErrors
      })
    }
  } finally {
    canceled = false
    boxedSocket.close()
  }
}

export async function cancelGetDescriptors(): Promise<void> {
  canceled = true
}
