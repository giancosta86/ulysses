import express from "express"
import process from "process"
import path from "path"
import debug from "debug"
import http from "http"

import { setupWebSocket } from "./websocket"
import { DEFAULT_BACKEND_PORT, BACKEND_PORT_PARAM } from "./shared"

const inDevelopment = process.env.NODE_ENV == "development"

export const log = debug("server")

const app = express()

if (inDevelopment) {
  const FRONTEND_SERVER_PORT = 3000

  app.get("/", (req, res) => {
    res.redirect(
      `http://localhost:${FRONTEND_SERVER_PORT}/?${BACKEND_PORT_PARAM}=${DEFAULT_BACKEND_PORT}`
    )
  })
} else {
  const staticFilesDir = path.join(__dirname, "../public")
  app.use(express.static(staticFilesDir))
}

const httpServer = http.createServer(app)

setupWebSocket(httpServer)

export function startBackend(port: number, callback?: () => void) {
  httpServer.listen(port, callback)
}
