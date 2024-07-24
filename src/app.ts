import { envsPlugin } from "./infrastructure/adapters";
import { MongoDatabase } from "./infrastructure/db/mongo";
import { AppRoutes } from "./presentation/appRoutes";
import { Server } from "./presentation/server";

import { getEnvsByEnvironment } from "./shared/helpers/";
(async () => {
  main();
})();

async function main() {
  const { MONGO_URL, MONGO_DB_NAME } = getEnvsByEnvironment();
  await MongoDatabase.connect({
    mongoUrl: MONGO_URL,
    dbName: MONGO_DB_NAME,
  });
  const server = new Server({
    port: envsPlugin.PORT,
    public_path: envsPlugin.PUBLIC_PATH,
    routes: AppRoutes.routes,
  });
  server.start();
}
