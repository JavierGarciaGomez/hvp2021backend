"use strict";
const { Router } = require("express");
const { createActivityRegister, getAllActivityRegisters, getActiviyRegistersByCol, updateActiviyRegister, deleteActivityRegister, getActiviyRegister, } = require("../controllers/activityRegisterController");
const { validateJwt } = require("../../presentation/middlewares/validateJwt");
const router = Router();
/************ CRUD********* */
// todo: add authorizations
// CREATE
router.post("/", validateJwt, createActivityRegister);
// GET ALL
router.get("/", validateJwt, getAllActivityRegisters);
// GET ACTIVITY REGISTER
router.get("/:activityRegister", validateJwt, getActiviyRegister);
// GET ALL BY USER
router.get("/getByCol/:collaboratorId", validateJwt, getActiviyRegistersByCol);
// UPDATE ACTIVITY REGISTER
router.put("/:activityRegisterId", validateJwt, updateActiviyRegister);
// DELETE ACTIVITY REGISTER
router.delete("/:activityRegisterId", validateJwt, deleteActivityRegister);
module.exports = router;
