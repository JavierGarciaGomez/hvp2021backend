/* Users routes:
    host/api/cleanups
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  checkDailyCleanUpsAndGenerate,
  updateDailyCleanUp,
  createDeepCleanUp,
  getDeepCleanUps,
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
// todo redesign this to be ge get sending string
router.post("/deep/", validateJwt, getDeepCleanUps);

module.exports = router;
