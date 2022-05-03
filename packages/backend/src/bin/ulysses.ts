#!/usr/bin/env node
import process from "process"
import open from "open"
import { startBackend } from "../server"

const inProduction =
  !process.env.NODE_ENV || process.env.NODE_ENV === "production"

const args = process.argv.slice(2)

const DEFAULT_BACKEND_PORT = 2000
const port = parseInt(args[0]) || DEFAULT_BACKEND_PORT

startBackend(inProduction, port, () => {
  const url = `http://localhost:${port}/`

  console.log(`Listening on url: ${url}`)

  open(url)
})
