/* Users routes:
    host/api/cleanups
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  checkCleanUpsAndGenerate,
  editCleanUp,
} = require("../controllers/cleanUpsController");
const { validarJWT } = require("../middlewares/validar-jwt");
// const { fieldValidator } = require("../middlewares/fieldValidator");
// const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/daily/checkCleanUpsAndGenerate", checkCleanUpsAndGenerate);
router.patch("/daily/:dailyCleanUpId", editCleanUp);

module.exports = router;
