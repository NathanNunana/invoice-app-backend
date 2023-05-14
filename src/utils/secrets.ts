import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
  console.log("Using .env file to supply config environment variables");
  dotenv.config({ path: ".env" });
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'


export const APP_PASSWORD = process.env["APP_PASSWORD"];
export const APP_EMAIL = process.env["APP_EMAIL"];

export const POSTGRES_USER = prod
  ? process.env["POSTGRES_USER"]
  : process.env["POSTGRES_LOCAL_USER"];
export const POSTGRES_HOST = prod
  ? process.env["POSTGRES_HOST"]
  : process.env["POSTGRES_LOCAL_HOST"];
export const POSTGRES_DATABASE = prod
  ? process.env["POSTGRES_DATABASE"]
  : process.env["POSTGRES_LOCAL_DATABASE"];
export const POSTGRES_PORT = prod
  ? process.env["POSTGRES_PORT"]
  : process.env["POSTGRES_LOCAL_PORT"];
export const POSTGRES_PASSWORD = prod
  ? process.env["POSTGRES_PASSWORD"]
  : process.env["POSTGRES_LOCAL_PASSWORD"];
export const DATABASE_URL = process.env["DATABASE_URL"];
