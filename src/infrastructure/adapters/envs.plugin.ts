import "dotenv/config";
import * as env from "env-var";

export const envsPlugin = {
  NODE_ENV: env.get("NODE_ENV").required().asString(),

  // Environment: Development
  DEV_MONGO_URL: env.get("DEV_MONGO_URL").default("").asString(),
  DEV_MONGO_DB_NAME: env.get("DEV_MONGO_DB_NAME").default("").asString(),
  DEV_MONGO_USER: env.get("DEV_MONGO_USER").default("").asString(),
  DEV_MONGO_PASS: env.get("DEV_MONGO_PASS").default("").asString(),
  DEV_CLIENT_URL: env.get("DEV_CLIENT_URL").default("").asString(),
  DEV_CLIENT_URL2: env.get("DEV_CLIENT_URL2").default("").asString(),

  // Environment: Production
  PROD_MONGO_URL: env.get("PROD_MONGO_URL").default("").asString(),
  PROD_MONGO_DB_NAME: env.get("PROD_MONGO_DB_NAME").default("").asString(),
  PROD_MONGO_USER: env.get("PROD_MONGO_USER").default("").asString(),
  PROD_MONGO_PASS: env.get("PROD_MONGO_PASS").default("").asString(),
  PROD_CLIENT_URL: env.get("PROD_CLIENT_URL").default("").asString(),
  PROD_CLIENT_URL2: env.get("PROD_CLIENT_URL2").default("").asString(),

  // Environment: Test
  // TEST_MONGO_URL: env.get("TEST_MONGO_URL").asString(),
  // TEST_MONGO_DB_NAME: env.get("TEST_MONGO_DB_NAME").asString(),
  // TEST_MONGO_USER: env.get("TEST_MONGO_USER").asString(),
  // TEST_MONGO_PASS: env.get("TEST_MONGO_PASS").asString(),
  // TEST_CLIENT_URL: env.get("TEST_CLIENT_URL").asString(),
  // TEST_CLIENT_URL2: env.get("TEST_CLIENT_URL2").asString(),

  // Environment: Common
  PORT: env.get("PORT").default("4000").asPortNumber(),
  BASE_URL: env.get("BASE_URL").default("http://localhost:4000").asString(),
  MAILER_EMAIL: env.get("MAILER_EMAIL").default("test@test.com").asString(),
  MAILER_SECRET_KEY: env.get("MAILER_SECRET_KEY").default("test-secret").asString(),
  MAILER_SERVICE: env.get("MAILER_SERVICE").default("gmail").asString(),
  PUBLIC_PATH: env.get("PUBLIC_PATH").default("public").asString(),
  GOOGLE_CLIENT_ID: env.get("GOOGLE_CLIENT_ID").default("test-client-id").asString(),
  GOOGLE_CLIENT_SECRET: env.get("GOOGLE_CLIENT_SECRET").default("test-secret").asString(),
  SECRET_JWT_SEED: env.get("SECRET_JWT_SEED").default("test-jwt-secret").asString(),
  CLOUDINARY_CLOUD_NAME: env.get("CLOUDINARY_CLOUD_NAME").default("test-cloud").asString(),
  CLOUDINARY_API_KEY: env.get("CLOUDINARY_API_KEY").default("test-key").asString(),
  CLOUDINARY_API_SECRET: env.get("CLOUDINARY_API_SECRET").default("test-secret").asString(),

  // Logging Configuration
  API_LOGGER_ENABLED: env.get("API_LOGGER_ENABLED").default("false").asBool(),
  DEBUG_LOGGER_ENABLED: env.get("DEBUG_LOGGER_ENABLED").default("false").asBool(),
  LOG_RETENTION_DAYS: env.get("LOG_RETENTION_DAYS").default("7").asIntPositive(),
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
  CLOUDINARY_CLOUD_NAME: envsPlugin.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: envsPlugin.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: envsPlugin.CLOUDINARY_API_SECRET,
  API_LOGGER_ENABLED: envsPlugin.API_LOGGER_ENABLED,
  DEBUG_LOGGER_ENABLED: envsPlugin.DEBUG_LOGGER_ENABLED,
  LOG_RETENTION_DAYS: envsPlugin.LOG_RETENTION_DAYS,
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
  MONGO_URL: envsPlugin.DEV_MONGO_URL,
  MONGO_DB_NAME: envsPlugin.DEV_MONGO_DB_NAME,
  MONGO_USER: envsPlugin.DEV_MONGO_USER,
  MONGO_PASS: envsPlugin.DEV_MONGO_PASS,
  CLIENT_URL: envsPlugin.DEV_CLIENT_URL,
  CLIENT_URL2: envsPlugin.DEV_CLIENT_URL2,
};
