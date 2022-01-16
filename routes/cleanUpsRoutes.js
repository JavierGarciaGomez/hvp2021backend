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

router.get("/go", (req, res) => {
  res.send("hola");
});

// router.get(
//   "/daily/checkCleanUpsAndGenerate",
//   validarJWT,
//   checkCleanUpsAndGenerate
// );
// router.patch("/daily/", validarJWT, editCleanUp);

module.exports = router;
