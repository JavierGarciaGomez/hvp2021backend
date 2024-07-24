"use strict";
/* Users routes:
    host/api/cleanups
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupsRouter = void 0;
const validateJwt_1 = require("../../presentation/middlewares/validateJwt");
const utilities_1 = require("../helpers/utilities");
const { Router } = require("express");
const { updateDailyCleanUp, createDeepCleanUp, getDeepCleanUps, getDeepCleanUp, updateDeepCleanUp, getDailyCleanUpsAndGenerate, getOperatingRoomCleanUps, updateOperatingRoomCleanUp, createOperatingRoomCleanUp, getAllCleanUpsFromLastMonth, } = require("../controllers/cleanUpsController");
utilities_1.validateMaxDays;
// const { fieldValidator } = require("../middlewares/fieldValidator");
// const { validarJWT } = require("../middlewares/validar-jwt");
exports.cleanupsRouter = Router();
exports.cleanupsRouter.get("/allLastMonth", validateJwt_1.validateJwt, getAllCleanUpsFromLastMonth);
exports.cleanupsRouter.get("/daily/:branch", validateJwt_1.validateJwt, getDailyCleanUpsAndGenerate);
exports.cleanupsRouter.patch("/daily/:branch/:dailyCleanUpId", validateJwt_1.validateJwt, updateDailyCleanUp);
exports.cleanupsRouter.post("/deep/createNew", validateJwt_1.validateJwt, createDeepCleanUp);
exports.cleanupsRouter.get("/deep/:branch", validateJwt_1.validateJwt, getDeepCleanUps);
exports.cleanupsRouter.get("/deep/:branch/:deepCleanUpId", validateJwt_1.validateJwt, getDeepCleanUp);
exports.cleanupsRouter.put("/deep/:branch/:deepCleanUpId", validateJwt_1.validateJwt, updateDeepCleanUp);
exports.cleanupsRouter.post("/operatingRoom/:branch/createNew", validateJwt_1.validateJwt, createOperatingRoomCleanUp);
exports.cleanupsRouter.get("/operatingRoom/:branch", validateJwt_1.validateJwt, getOperatingRoomCleanUps);
exports.cleanupsRouter.patch("/operatingRoom/:branch/:operatingRoomCleanUpId", validateJwt_1.validateJwt, updateOperatingRoomCleanUp);
