#!/usr/bin/env node
import process from "process"
import open from "open"
import { startBackend } from "../server"
import { DEFAULT_BACKEND_PORT } from "../server/shared"

const args = process.argv.slice(2)
const port = parseInt(args[0]) || DEFAULT_BACKEND_PORT

const inProduction = process.env.NODE_ENV === "production"

startBackend(port, inProduction, () => {
  const url = `http://localhost:${port}/`

  console.log(`Listening on url: ${url}`)

  open(url)
})
