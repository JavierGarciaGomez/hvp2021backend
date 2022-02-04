/* Users routes:
    host/api/cleanups
*/

const { Router } = require("express");
const { check } = require("express-validator");
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
const { validateJwt } = require("../middlewares/validateJwt");
// const { fieldValidator } = require("../middlewares/fieldValidator");
// const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/allLastMonth", validateJwt, getAllCleanUpsFromLastMonth);
router.get("/daily/:branch", validateJwt, getDailyCleanUpsAndGenerate);
router.patch("/daily/:branch/:dailyCleanUpId", validateJwt, updateDailyCleanUp);

router.post("/deep/createNew", validateJwt, createDeepCleanUp);
router.get("/deep/:branch", validateJwt, getDeepCleanUps);
router.get("/deep/:branch/:deepCleanUpId", validateJwt, getDeepCleanUp);
router.put("/deep/:branch/:deepCleanUpId", validateJwt, updateDeepCleanUp);

router.post(
  "/operatingRoom/:branch/createNew",
  validateJwt,
  createOperatingRoomCleanUp
);
router.get("/operatingRoom/:branch", validateJwt, getOperatingRoomCleanUps);
router.patch(
  "/operatingRoom/:branch/:operatingRoomCleanUpId",
  validateJwt,
  updateOperatingRoomCleanUp
);

module.exports = router;
