import express from "express"
import path from "path"
import debug from "debug"
import http from "http"

import { setupWebSocket } from "./websocket"
import { DEFAULT_BACKEND_PORT, BACKEND_PORT_PARAM } from "./shared"

export const log = debug("server")

export function startBackend(
  port: number,
  inProduction: boolean,
  callback?: () => void
) {
  const app = express()

  if (inProduction) {
    const staticFilesDir = path.join(__dirname, "../public")
    app.use(express.static(staticFilesDir))
  } else {
    const FRONTEND_SERVER_PORT = 3000

    app.get("/", (req, res) => {
      res.redirect(
        `http://localhost:${FRONTEND_SERVER_PORT}/?${BACKEND_PORT_PARAM}=${DEFAULT_BACKEND_PORT}`
      )
    })
  }

  const httpServer = http.createServer(app)

  setupWebSocket(httpServer)
  httpServer.listen(port, callback)
}
