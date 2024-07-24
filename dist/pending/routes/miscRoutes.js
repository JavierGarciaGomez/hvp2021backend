"use strict";
/* Users routes:
    host/api/authLogs
*/
const { Router } = require("express");
const { createActivityRegister, getAllActivityRegisters, getActiviyRegistersByCol, updateActiviyRegister, deleteActivityRegister, } = require("../controllers/activityRegisterController");
const { createMisc, getAllMisc, getMiscByKey, updateMisc, deleteMisc, } = require("../controllers/miscController");
const { getLogs } = require("../controllers/userLogController");
const { validateJwt } = require("../../presentation/middlewares/validateJwt");
const router = Router();
/************ CRUD********* */
router.post("/", validateJwt, createMisc);
// GET ALL
router.get("/", validateJwt, getAllMisc);
// GET ALL BY USER
router.get("/:key", validateJwt, getMiscByKey);
// UPDATE ACTIVITY REGISTER
router.put("/:key", validateJwt, updateMisc);
// DELETE ACTIVITY REGISTER
router.delete("/:key", validateJwt, deleteMisc);
module.exports = router;
