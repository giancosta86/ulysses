import io from "socket.io-client";
import * as socketEvents from "@BackendServer/socketEvents";
import { LineResult } from "@BackendModel/LineResult";
import { CourseDescriptor } from "@BackendModel/CourseDescriptor";
import { LineError } from "@BackendModel/LineError";

export class BoxedSocket {
  private readonly socket;
  private onResultRetrieved?: (lineResult: LineResult) => void;

  constructor(backendPort: number) {
    this.socket = io
      .connect(`localhost:${backendPort}`)
      .on(
        socketEvents.COURSE_DESCRIPTOR,
        (courseDescriptor: CourseDescriptor) => {
          this.onResultRetrieved?.(courseDescriptor);
        }
      )
      .on(socketEvents.LINE_ERROR, (lineError: LineError) => {
        this.onResultRetrieved?.(lineError);
      });
  }

  getLineResult(line: string): Promise<LineResult> {
    return new Promise(resolve => {
      this.onResultRetrieved = resolve;
      this.socket.emit(socketEvents.GET_COURSE_DESCRIPTOR, line);
    });
  }

  close() {
    this.socket.emit(socketEvents.END);
  }
}
