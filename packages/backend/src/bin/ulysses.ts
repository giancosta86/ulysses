#!/usr/bin/env node
import process from "process";
import open from "open";
import { startBackend } from "../server";
import { nodeEnv } from "@giancosta86/typed-env";

const inProduction = nodeEnv.inProduction.getValue(() => true);

const args = process.argv.slice(2);

const DEFAULT_BACKEND_PORT = 2000;
const port = parseInt(args[0]) || DEFAULT_BACKEND_PORT;

startBackend(inProduction, port, () => {
  const url = `http://localhost:${port}/`;

  console.log(`Listening on url: ${url}`);

  open(url);
});
