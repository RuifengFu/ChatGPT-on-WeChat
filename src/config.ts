import * as dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import { parse } from "yaml";
import { IConfig } from "./interface";
import path from 'path';

let configFile: any = {};

// get configurations from 'config.yaml' first
const configPath = path.resolve('./config.yaml');

console.log(`Current working directory: ${process.cwd()}`);
console.log(`Config path: ${configPath}`);
console.log(`Config file exists: ${fs.existsSync(configPath)}`);
if (fs.existsSync(configPath) && fs.statSync(configPath).isFile()) {
  console.log("load from config.yaml");
  try {
    const file = fs.readFileSync(configPath, "utf8");
    configFile = parse(file);
  } catch (error) {
    console.error(`Error reading config file: ${error}`);
  }
} 
// if 'config.yaml' not exist, read them from env
else {
  console.log("Config file not found or not a file, reading from environment");
  configFile = {
    openaiApiKey: process.env.OPENAI_API_KEY,
    openaiOrganizationID: process.env.OPENAI_ORGANIZATION_KEY,
    chatgptTriggerKeyword: process.env.CHATGPT_TRIGGER_KEYWORD,
    baseURL: process.env.OPENAI_BASE_URL, 
  };
  console.log(`Environment variables:`);
  console.log(`OPENAI_API_KEY: ${process.env.OPENAI_API_KEY}`);
  console.log(`OPENAI_ORGANIZATION_KEY: ${process.env.OPENAI_ORGANIZATION_KEY}`);
  console.log(`CHATGPT_TRIGGER_KEYWORD: ${process.env.CHATGPT_TRIGGER_KEYWORD}`);
  console.log(`OPENAI_BASE_URL: ${process.env.OPENAI_BASE_URL}`);
  console.log(`Configured from env: ${JSON.stringify(configFile)}`);
}

// warning if no OpenAI API key found
if (configFile.openaiApiKey === undefined) {
  console.error(
    "⚠️ No OPENAI_API_KEY found in env, please export to env or configure in config.yaml"
  );
}

export const Config: IConfig = {
  openaiApiKey: configFile.openaiApiKey,
  openaiOrganizationID: configFile.openaiOrganizationID || "",
  chatgptTriggerKeyword: configFile.chatgptTriggerKeyword || "",
  baseURL: configFile.baseURL || "https://api.openai.com/v1/",
  modelName: configFile.modelName || "gpt-4o"
};
