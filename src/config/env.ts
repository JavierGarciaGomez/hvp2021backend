import "dotenv/config";
import { get } from "env-var";

export const envs = {
  PORT: get("PORT").default(4000).required().asPortNumber(),
  GOOGLE_CLIENT_ID: get("GOOGLE_CLIENT_ID").required().asString(),
  GOOGLE_CLIENT_SECRET: get("GOOGLE_CLIENT_SECRET").required().asString(),
  CLIENT_URL: get("CLIENT_URL").required().asString(),
  DB_CNN: get("DB_CNN").required().asString(),
  SECRET_JWT_SEED: get("SECRET_JWT_SEED").required().asString(),

  //   MONGO_USERNAME: get("MONGO_USERNAME").required().asString(),
  //   MONGO_PASSWORD: get("MONGO_PASSWORD").required().asString(),
  //   MONGO_DATABASE: get("MONGO_DATABASE").required().asString(),
  //   MONGO_URL: get("MONGO_URL").required().asString(),
  //   JWT_SEED: get("JWT_SEED").required().asString(),

  MAILER_SERVICE: get("MAILER_SERVICE").required().asString(),
  MAILER_EMAIL: get("MAILER_EMAIL").required().asString(),
  MAILER_SECRET_KEY: get("MAILER_SECRET_KEY").required().asString(),

  //   WEBSERVICE_URL: get("WEBSERVICE_URL").required().asString(),
  SEND_EMAIL: get("SEND_EMAIL").default("false").asBool(),
  BASE_URL: get("BASE_URL").required().asString(),
};
