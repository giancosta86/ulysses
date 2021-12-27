import React from "react"

import { useHomeState } from "./HomeState"

import logo from "../images/logo.svg"
import spinner from "../images/spinner.svg"

export default function Home() {
  const {
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
  } = useHomeState()

  function showHelp(): void {
    window.open("https://github.com/giancosta86/ulysses")
  }

  return (
    <div className="main">
      <img className="logo" src={logo} />
      <h1>Ulysses</h1>

      <div className="input-box">
        <p>Input:</p>
        <textarea
          value={inputText}
          readOnly={inProgress}
          onChange={(event) => setInputText(event.target.value)}
        />
      </div>
      <div className="control-box">
        <button
          disabled={inProgress || !inputText.trim()}
          onClick={startFetchingDescriptors}
        >
          Run
        </button>

        <button disabled={!inProgress} onClick={cancelFetchingDescriptors}>
          Cancel
        </button>

        <button
          onClick={clearResults}
          disabled={
            inProgress ||
            (courseDescriptorsText.length == 0 && lineErrorsText.length == 0)
          }
        >
          Clear results
        </button>

        <button onClick={showHelp}>Help</button>
      </div>

      <div className="progress-box">
        <img hidden={!inProgress} className="spinner" src={spinner} />

        <progress
          hidden={!inProgress}
          value={processedLinesCount}
          max={actualInputLinesCount}
        ></progress>
      </div>

      <div
        className="descriptor-box"
        hidden={inProgress || courseDescriptorsText.length == 0}
      >
        <p>Descriptors:</p>
        <textarea cols={50} rows={15} value={courseDescriptorsText} readOnly />
      </div>

      <div
        className="error-box"
        hidden={inProgress || lineErrorsText.length == 0}
      >
        <p>Errors:</p>
        <textarea cols={50} rows={15} value={lineErrorsText} readOnly />
      </div>
    </div>
  )
}
