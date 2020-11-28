#!/usr/bin/env node
import process from "process"
import open from "open"
import { startBackend } from "../server"
import { DEFAULT_BACKEND_PORT } from "../server/shared"

process.env.NODE_ENV ||= "production"

const args = process.argv.slice(2)
const port = args[0] ? parseInt(args[0]) : DEFAULT_BACKEND_PORT

startBackend(port, () => {
  const url = `http://localhost:${port}/`

  console.log(`Listening on url: ${url}`)

  open(url)
})
