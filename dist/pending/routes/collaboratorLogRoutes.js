"use strict";
const { Router } = require("express");
const { getLogs } = require("../controllers/collaboratorLogController");
const { validateJwt } = require("../../presentation/middlewares/validateJwt");
const router = Router();
router.get("/", validateJwt, getLogs);
module.exports = router;
