const { Router } = require("express");
const {
  createDocumentation,
  getAllDocumentation,
  getDocumentation,
  updateDocumentation,
  deleteDocumentation,
  insertDummy,
} = require("../controllers/documentationController");

const { validateJwt } = require("../../presentation/middlewares/validateJwt");

validateJwt;
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
// todo delete
router.post("/insertDummy/", validateJwt, insertDummy);

module.exports = router;
