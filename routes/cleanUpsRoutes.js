/* Users routes:
    host/api/cleanups
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  checkDailyCleanUpsAndGenerate,
  updateDailyCleanUp,
  createDeepCleanUp,
} = require("../controllers/cleanUpsController");
const { validateJwt } = require("../middlewares/validateJwt");
// const { fieldValidator } = require("../middlewares/fieldValidator");
// const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get(
  "/daily/checkCleanUpsAndGenerate",
  validateJwt,
  checkDailyCleanUpsAndGenerate
);
router.patch("/daily/", validateJwt, updateDailyCleanUp);

router.post("/deep/createNew", validateJwt, createDeepCleanUp);

module.exports = router;
