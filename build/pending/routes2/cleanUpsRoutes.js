"use strict";
/* Users routes:
    host/api/cleanups
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupsRouter = void 0;
const { Router } = require("express");
const { check } = require("express-validator");
const { updateDailyCleanUp, createDeepCleanUp, getDeepCleanUps, getDeepCleanUp, updateDeepCleanUp, getDailyCleanUpsAndGenerate, getOperatingRoomCleanUps, updateOperatingRoomCleanUp, createOperatingRoomCleanUp, getAllCleanUpsFromLastMonth, } = require("../controllers/cleanUpsController");
const { validateJwt } = require("../../presentation/middlewares/validateJwt");
// const { fieldValidator } = require("../middlewares/fieldValidator");
// const { validarJWT } = require("../middlewares/validar-jwt");
exports.cleanupsRouter = Router();
exports.cleanupsRouter.get("/allLastMonth", validateJwt, getAllCleanUpsFromLastMonth);
exports.cleanupsRouter.get("/daily/:branch", validateJwt, getDailyCleanUpsAndGenerate);
exports.cleanupsRouter.patch("/daily/:branch/:dailyCleanUpId", validateJwt, updateDailyCleanUp);
exports.cleanupsRouter.post("/deep/createNew", validateJwt, createDeepCleanUp);
exports.cleanupsRouter.get("/deep/:branch", validateJwt, getDeepCleanUps);
exports.cleanupsRouter.get("/deep/:branch/:deepCleanUpId", validateJwt, getDeepCleanUp);
exports.cleanupsRouter.put("/deep/:branch/:deepCleanUpId", validateJwt, updateDeepCleanUp);
exports.cleanupsRouter.post("/operatingRoom/:branch/createNew", validateJwt, createOperatingRoomCleanUp);
exports.cleanupsRouter.get("/operatingRoom/:branch", validateJwt, getOperatingRoomCleanUps);
exports.cleanupsRouter.patch("/operatingRoom/:branch/:operatingRoomCleanUpId", validateJwt, updateOperatingRoomCleanUp);
