import * as path from "path";
import fs from "fs";
import snakeCase from "lodash/snakeCase";
import { Whatsapp } from "./Whatsapp";

const isDevelopment = process.env.NODE_ENV === "dev";
const executionRootPath = isDevelopment
  ? path.resolve(__dirname, "..")
  : path.resolve(__dirname);
const credentialsPath = path.join(executionRootPath, "files");

const config = JSON.parse(
  fs.readFileSync(path.join(executionRootPath, "config.json"), "utf-8")
);

const run = async () => {
  const wpp = new Whatsapp({
    name: snakeCase(config.name),
    credentialsPath: credentialsPath,
    preferences: {
      writingTimeInMs: Number(config.writingTimeInMs),
    },
  });

  await wpp.connect();

  await wpp.sendMessage("557192711726", {
    text: "Testando",
  });
};

// run();
