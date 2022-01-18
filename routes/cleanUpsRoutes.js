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
} = require("../controllers/cleanUpsController");
const { validateJwt } = require("../middlewares/validateJwt");
// const { fieldValidator } = require("../middlewares/fieldValidator");
// const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/daily/:branch", validateJwt, getDailyCleanUpsAndGenerate);
router.patch("/daily/:branch/:dailyCleanUpId", validateJwt, updateDailyCleanUp);

router.post("/deep/createNew", validateJwt, createDeepCleanUp);
router.get("/deep/:branch", validateJwt, getDeepCleanUps);
router.get("/deep/:branch/:deepCleanUpId", validateJwt, getDeepCleanUp);
router.put("/deep/:branch/:deepCleanUpId", validateJwt, updateDeepCleanUp);

module.exports = router;
