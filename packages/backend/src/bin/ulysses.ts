#!/usr/bin/env node
import process from "node:process";
import open from "open";
import { isInProduction } from "@giancosta86/typed-env";
import { startBackend } from "../server";

const inProduction = isInProduction(true);

const args = process.argv.slice(2);

const DEFAULT_BACKEND_PORT = 2000;
const port = parseInt(args[0] ?? "") || DEFAULT_BACKEND_PORT;

startBackend(inProduction, port, () => {
  const url = `http://localhost:${port}/`;

  console.info(`Listening on url: ${url}`);

  open(url);
});
