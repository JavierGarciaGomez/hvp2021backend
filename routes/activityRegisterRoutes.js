/* Users routes:
    host/api/authLogs
*/

const { Router } = require("express");
const {
  createActivityRegister,
  getAllActivityRegisters,
  getActiviyRegistersByCol,
  updateActiviyRegister,
  deleteActivityRegister,
} = require("../controllers/activityRegisterController");
const { getLogs } = require("../controllers/userLogController");

const { validateJwt } = require("../middlewares/validateJwt");
const router = Router();

/************ CRUD********* */
// todo: add authorizations
// CREATE
router.post("/", validateJwt, createActivityRegister);

// GET ALL
router.get("/", validateJwt, getAllActivityRegisters);

// GET ALL BY USER
router.get("/:collaboratorId", validateJwt, getActiviyRegistersByCol);

// UPDATE ACTIVITY REGISTER
router.put("/:activityRegisterId", validateJwt, updateActiviyRegister);

// DELETE ACTIVITY REGISTER
router.delete("/:activityRegisterId", validateJwt, deleteActivityRegister);

module.exports = router;
