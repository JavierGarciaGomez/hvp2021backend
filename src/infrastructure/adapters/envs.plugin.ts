import "dotenv/config";
import * as env from "env-var";

export const envsPlugin = {
  NODE_ENV: env.get("NODE_ENV").required().asString(),

  // Environment: Development

  DEV_MONGO_URL: env.get("DEV_MONGO_URL").required().asString(),
  DEV_MONGO_DB_NAME: env.get("DEV_MONGO_DB_NAME").required().asString(),
  DEV_MONGO_USER: env.get("DEV_MONGO_USER").required().asString(),
  DEV_MONGO_PASS: env.get("DEV_MONGO_PASS").required().asString(),
  DEV_CLIENT_URL: env.get("DEV_CLIENT_URL").required().asString(),
  DEV_CLIENT_URL2: env.get("DEV_CLIENT_URL2").required().asString(),

  // Environment: Production
  PROD_MONGO_URL: env.get("PROD_MONGO_URL").required().asString(),
  PROD_MONGO_DB_NAME: env.get("PROD_MONGO_DB_NAME").required().asString(),
  PROD_MONGO_USER: env.get("PROD_MONGO_USER").required().asString(),
  PROD_MONGO_PASS: env.get("PROD_MONGO_PASS").required().asString(),
  PROD_CLIENT_URL: env.get("PROD_CLIENT_URL").required().asString(),
  PROD_CLIENT_URL2: env.get("PROD_CLIENT_URL2").required().asString(),

  // Environment: Test
  TEST_MONGO_URL: env.get("TEST_MONGO_URL").required().asString(),
  TEST_MONGO_DB_NAME: env.get("TEST_MONGO_DB_NAME").required().asString(),
  TEST_MONGO_USER: env.get("TEST_MONGO_USER").required().asString(),
  TEST_MONGO_PASS: env.get("TEST_MONGO_PASS").required().asString(),
  TEST_CLIENT_URL: env.get("TEST_CLIENT_URL").required().asString(),
  TEST_CLIENT_URL2: env.get("TEST_CLIENT_URL2").required().asString(),

  // Environment: Common
  PORT: env.get("PORT").required().asPortNumber(),
  BASE_URL: env.get("BASE_URL").required().asString(),
  MAILER_EMAIL: env.get("MAILER_EMAIL").required().asEmailString(),
  MAILER_SECRET_KEY: env.get("MAILER_SECRET_KEY").required().asString(),
  MAILER_SERVICE: env.get("MAILER_SERVICE").required().asString(),
  PUBLIC_PATH: env.get("PUBLIC_PATH").required().asString(),
  GOOGLE_CLIENT_ID: env.get("GOOGLE_CLIENT_ID").required().asString(),
  GOOGLE_CLIENT_SECRET: env.get("GOOGLE_CLIENT_SECRET").required().asString(),
  SECRET_JWT_SEED: env.get("SECRET_JWT_SEED").required().asString(),
};

export const commonEnvs = {
  BASE_URL: envsPlugin.BASE_URL,
  PORT: envsPlugin.PORT,
  MAILER_EMAIL: envsPlugin.MAILER_EMAIL,
  MAILER_SECRET_KEY: envsPlugin.MAILER_SECRET_KEY,
  MAILER_SERVICE: envsPlugin.MAILER_SERVICE,
  PUBLIC_PATH: envsPlugin.PUBLIC_PATH,
  GOOGLE_CLIENT_ID: envsPlugin.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: envsPlugin.GOOGLE_CLIENT_SECRET,
  SECRET_JWT_SEED: envsPlugin.SECRET_JWT_SEED,
};

export const devEnvs = {
  NODE_ENV: envsPlugin.NODE_ENV,
  MONGO_URL: envsPlugin.DEV_MONGO_URL,
  MONGO_DB_NAME: envsPlugin.DEV_MONGO_DB_NAME,
  MONGO_USER: envsPlugin.DEV_MONGO_USER,
  MONGO_PASS: envsPlugin.DEV_MONGO_PASS,
  CLIENT_URL: envsPlugin.DEV_CLIENT_URL,
  CLIENT_URL2: envsPlugin.DEV_CLIENT_URL2,
};

export const prodEnvs = {
  NODE_ENV: envsPlugin.NODE_ENV,
  MONGO_URL: envsPlugin.PROD_MONGO_URL,
  MONGO_DB_NAME: envsPlugin.PROD_MONGO_DB_NAME,
  MONGO_USER: envsPlugin.PROD_MONGO_USER,
  MONGO_PASS: envsPlugin.PROD_MONGO_PASS,
  CLIENT_URL: envsPlugin.PROD_CLIENT_URL,
  CLIENT_URL2: envsPlugin.PROD_CLIENT_URL2,
};

export const testEnvs = {
  NODE_ENV: envsPlugin.NODE_ENV,
  MONGO_URL: envsPlugin.TEST_MONGO_URL,
  MONGO_DB_NAME: envsPlugin.TEST_MONGO_DB_NAME,
  MONGO_USER: envsPlugin.TEST_MONGO_USER,
  MONGO_PASS: envsPlugin.TEST_MONGO_PASS,
  CLIENT_URL: envsPlugin.TEST_CLIENT_URL,
  CLIENT_URL2: envsPlugin.TEST_CLIENT_URL2,
};
