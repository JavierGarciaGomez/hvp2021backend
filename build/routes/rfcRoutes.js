"use strict";
/* Users routes:
    host/api/cleanups
*/
const { Router } = require("express");
const { check } = require("express-validator");
const {} = require("../controllers/cleanUpsController");
const { createRFC, updateRFC, getAllRfc, deleteRFC, } = require("../controllers/rfcController");
const { fieldValidator } = require("../middlewares/fieldValidator");
const { validateJwt } = require("../middlewares/validateJwt");
// const { fieldValidator } = require("../middlewares/fieldValidator");
// const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();
router.get("/", validateJwt, getAllRfc);
router.post("", [
    check("rfc", "El RFC debe contar con 13 caracteres").isLength({
        min: 13,
        max: 13,
    }),
    check("email", "No es una forma correcta de email").isEmail(),
    check("name", "El nombre o la razón social es obligatorio").not().isEmpty(),
    validateJwt,
    fieldValidator,
], createRFC);
router.put("/:rfcId", [
    check("rfc", "El RFC debe contar con 13 caracteres").isLength({
        min: 13,
        max: 13,
    }),
    check("email", "No es una forma correcta de email").isEmail(),
    check("name", "El nombre o la razón social es obligatorio").not().isEmpty(),
    validateJwt,
    fieldValidator,
], updateRFC);
router.delete("/:rfcId", validateJwt, deleteRFC);
module.exports = router;
