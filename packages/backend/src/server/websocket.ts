import http from "http";
import debug from "debug";
import { Server, Socket } from "socket.io";
import {
  GET_COURSE_DESCRIPTOR,
  COURSE_DESCRIPTOR,
  LINE_ERROR,
  END
} from "./shared/socketEvents";
import { getCourseDescriptor } from "../model/pipeline";
import { GalleryPageParser } from "../model/pageParsing/GalleryPageParser";

const log = debug("server:socket");

const pageParser = new GalleryPageParser();

function createWebSocketOptions(inProduction: boolean) {
  return inProduction
    ? {}
    : {
        cors: {
          origin: "*"
        }
      };
}

export function setupWebSocket(
  httpServer: http.Server,
  inProduction: boolean
): void {
  const webSocketOptions = createWebSocketOptions(inProduction);

  const webSocketServer = new Server(httpServer, webSocketOptions);

  webSocketServer.on("connection", (socket: Socket) => {
    log("Socket connection established! ^__^");

    socket
      .on(GET_COURSE_DESCRIPTOR, async (line: string) => {
        log(`Course descriptor requested. Line: '${line}'`);

        try {
          const courseDescriptorOption = await getCourseDescriptor(
            pageParser,
            line
          );
          if (courseDescriptorOption) {
            socket.emit(COURSE_DESCRIPTOR, courseDescriptorOption);
          } else {
            socket.emit(LINE_ERROR, {
              line,
              message: `Could not extract a descriptor`
            });
          }
        } catch (err) {
          socket.emit(LINE_ERROR, {
            line,
            message:
              err instanceof Error ? err.message : `Generic err value: ${err}`
          });
        }
      })
      .on(END, () => {
        socket.disconnect();
        log("Socket disconnected!");
      });
  });
}
