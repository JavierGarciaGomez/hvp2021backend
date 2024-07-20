/* Users routes:
    host/api/cleanups
*/

import { validateJwt } from "../../presentation/middlewares/validateJwt";
import { validateMaxDays } from "../helpers/utilities";

const { Router } = require("express");
const {
  updateDailyCleanUp,
  createDeepCleanUp,
  getDeepCleanUps,
  getDeepCleanUp,
  updateDeepCleanUp,
  getDailyCleanUpsAndGenerate,
  getOperatingRoomCleanUps,
  updateOperatingRoomCleanUp,
  createOperatingRoomCleanUp,
  getAllCleanUpsFromLastMonth,
} = require("../controllers/cleanUpsController");
validateMaxDays;
// const { fieldValidator } = require("../middlewares/fieldValidator");
// const { validarJWT } = require("../middlewares/validar-jwt");

export const cleanupsRouter = Router();

cleanupsRouter.get("/allLastMonth", validateJwt, getAllCleanUpsFromLastMonth);
cleanupsRouter.get("/daily/:branch", validateJwt, getDailyCleanUpsAndGenerate);
cleanupsRouter.patch(
  "/daily/:branch/:dailyCleanUpId",
  validateJwt,
  updateDailyCleanUp
);

cleanupsRouter.post("/deep/createNew", validateJwt, createDeepCleanUp);
cleanupsRouter.get("/deep/:branch", validateJwt, getDeepCleanUps);
cleanupsRouter.get("/deep/:branch/:deepCleanUpId", validateJwt, getDeepCleanUp);
cleanupsRouter.put(
  "/deep/:branch/:deepCleanUpId",
  validateJwt,
  updateDeepCleanUp
);

cleanupsRouter.post(
  "/operatingRoom/:branch/createNew",
  validateJwt,
  createOperatingRoomCleanUp
);
cleanupsRouter.get(
  "/operatingRoom/:branch",
  validateJwt,
  getOperatingRoomCleanUps
);
cleanupsRouter.patch(
  "/operatingRoom/:branch/:operatingRoomCleanUpId",
  validateJwt,
  updateOperatingRoomCleanUp
);
