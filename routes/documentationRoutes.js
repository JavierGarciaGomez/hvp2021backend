/* Users routes:
    host/api/authLogs
*/

const { Router } = require("express");
const {
  createDocumentation,
  getAllDocumentation,
  getDocumentation,
  updateDocumentation,
  deleteDocumentation,
} = require("../controllers/documentationController");
const { getLogs } = require("../controllers/userLogController");

const { validateJwt } = require("../middlewares/validateJwt");
const router = Router();

/************ CRUD********* */
router.post("/", validateJwt, createDocumentation);

// GET ALL
router.get("/", validateJwt, getAllDocumentation);

// GET ONE
router.get("/:id", validateJwt, getDocumentation);

// UPDATE ACTIVITY REGISTER
router.put("/:id", validateJwt, updateDocumentation);

// DELETE ACTIVITY REGISTER
router.delete("/:id", validateJwt, deleteDocumentation);

module.exports = router;
