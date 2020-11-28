import http from "http"
import debug from "debug"

import {
  GET_COURSE_DESCRIPTOR,
  COURSE_DESCRIPTOR,
  LINE_ERROR,
  END
} from "./shared/socketEvents"

import { getCourseDescriptor } from "../model/pipeline"
import { Server, Socket } from "socket.io"
import { GalleryPageParser } from "../model/pageParsing/GalleryPageParser"

const log = debug("server:socket")

const pageParser = new GalleryPageParser()

export function setupWebSocket(httpServer: http.Server): void {
  const webSocketServer = new Server(httpServer, {
    cors: {
      origin: "*"
    }
  })

  webSocketServer.on("connection", (socket: Socket) => {
    log("Socket connection established! ^__^")

    socket
      .on(GET_COURSE_DESCRIPTOR, async (line: string) => {
        log(`Course descriptor requested. Line: '${line}'`)

        try {
          const courseDescriptorOption = await getCourseDescriptor(
            pageParser,
            line
          )
          if (courseDescriptorOption.hasValue) {
            socket.emit(
              COURSE_DESCRIPTOR,
              courseDescriptorOption.valueOrFailure()
            )
          } else {
            socket.emit(LINE_ERROR, {
              line,
              message: `Could not extract a descriptor`
            })
          }
        } catch (err) {
          socket.emit(LINE_ERROR, {
            line,
            message:
              err instanceof Error ? err.message : `Generic err value: ${err}`
          })
        }
      })
      .on(END, () => {
        socket.disconnect()
        log("Socket disconnected!")
      })
  })
}
