import express from "express";
import path from "path";
import debug from "debug";
import http from "http";

import { setupWebSocket } from "./websocket";
import { BACKEND_PORT_PARAM } from "./shared";

export const log = debug("server");

export function startBackend(
  inProduction: boolean,
  port: number,
  callback?: () => void
) {
  const app = express();

  if (inProduction) {
    const staticFilesDir = path.join(__dirname, "../public");
    app.use(express.static(staticFilesDir));
  } else {
    const FRONTEND_SERVER_PORT = 3000;

    app.get("/", (req, res) => {
      res.redirect(
        `http://localhost:${FRONTEND_SERVER_PORT}/?${BACKEND_PORT_PARAM}=${port}`
      );
    });
  }

  const httpServer = http.createServer(app);

  setupWebSocket(httpServer, inProduction);
  httpServer.listen(port, callback);
}
