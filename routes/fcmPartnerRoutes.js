/* Users routes:
    host/api/authLogs
*/

const { Router } = require("express");
const {
  createFcmPartner,
  getAllFcmPartner,
  getFcmPartner,
  updateFcmPartner,
  deleteFcmPartner,
  insertDummy,
  getFcmPartnerByPartnerNum,
} = require("../controllers/fcmPartnerController");
const { getLogs } = require("../controllers/userLogController");

const { validateJwt } = require("../middlewares/validateJwt");
const router = Router();

/************ CRUD********* */
router.post("/", validateJwt, createFcmPartner);

// GET ALL
router.get("/", validateJwt, getAllFcmPartner);

// GET ONE
router.get("/:id", validateJwt, getFcmPartner);

// GET ONE BY PARTNERNUM
router.get(
  "/getByPartnerNum/:partnerNum",
  validateJwt,
  getFcmPartnerByPartnerNum
);

router.put("/:id", validateJwt, updateFcmPartner);

router.delete("/:id", validateJwt, deleteFcmPartner);

module.exports = router;
