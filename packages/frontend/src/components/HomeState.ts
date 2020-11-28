import { useState } from "react"

import { prettyPrintItems } from "../workers/pretty-printing.worker"
import {
  getDescriptors,
  cancelGetDescriptors,
  CourseWorkerResult
} from "../workers/course.worker"
import { CourseDescriptor } from "@BackendModel/CourseDescriptor"
import { BACKEND_PORT_PARAM } from "@BackendServer/index"
import * as Comlink from "comlink"

export function useHomeState() {
  const [inputText, setInputText] = useState("")
  const [courseDescriptors, setCourseDescriptors] = useState(
    [] as readonly CourseDescriptor[]
  )
  const [courseDescriptorsText, setCourseDescriptorsText] = useState("")
  const [lineErrorsText, setLineErrorsText] = useState("")
  const [inProgress, setInProgress] = useState(false)
  const [actualInputLinesCount, setActualInputLinesCount] = useState(0)
  const [processedLinesCount, setProcessedLinesCount] = useState(0)

  function startFetchingDescriptors(): void {
    setActualInputLinesCount(0)
    setProcessedLinesCount(0)
    setInProgress(true)

    const currentUrl = new URL(window.location.href)
    const backendPortParam = currentUrl.searchParams.get(BACKEND_PORT_PARAM)

    const backendPort = backendPortParam
      ? parseInt(backendPortParam)
      : parseInt(currentUrl.port)

    getDescriptors(
      backendPort,
      inputText,
      Comlink.proxy((gotActualInputLinesCount) =>
        setActualInputLinesCount(gotActualInputLinesCount)
      ),
      Comlink.proxy((gotProcessedLinesCount) =>
        setProcessedLinesCount(gotProcessedLinesCount)
      ),
      Comlink.proxy(updateOnCompletion)
    )
  }

  async function updateOnCompletion(courseWorkerResult: CourseWorkerResult) {
    setInputText(
      courseWorkerResult.lineErrors.map((error) => error.line).join("\n\n")
    )

    const newCourseDescriptors = [
      ...courseDescriptors,
      ...courseWorkerResult.courseDescriptors
    ]

    setCourseDescriptors(newCourseDescriptors)

    setCourseDescriptorsText(await prettyPrintItems(newCourseDescriptors))

    setLineErrorsText(await prettyPrintItems(courseWorkerResult.lineErrors))

    setInProgress(false)
  }

  function cancelFetchingDescriptors(): void {
    cancelGetDescriptors()
    setInProgress(false)
  }

  function clearResults() {
    setCourseDescriptors([])
    setCourseDescriptorsText("")
    setLineErrorsText("")
  }

  return {
    inputText,
    courseDescriptorsText,
    lineErrorsText,
    inProgress,
    actualInputLinesCount,
    processedLinesCount,

    setInputText,

    startFetchingDescriptors,
    cancelFetchingDescriptors,

    clearResults
  }
}
