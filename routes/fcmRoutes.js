/* Users routes:
    host/api/authLogs
*/

const { Router } = require("express");
const { check } = require("express-validator");
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
const { fieldValidator } = require("../middlewares/fieldValidator");

const { validateJwt } = require("../middlewares/validateJwt");
const router = Router();

/************ CRUD********* */
router.post("/partners/", validateJwt, createFcmPartner);

// GET ALL
router.get("/partners/", validateJwt, getAllFcmPartner);

// GET ONE
router.get("/partners/:id", validateJwt, getFcmPartner);

// GET ONE BY PARTNERNUM
router.get(
  "/partners/partner/:partnerNum",
  validateJwt,
  getFcmPartnerByPartnerNum
);

router.put("/partners/:id", validateJwt, updateFcmPartner);

router.delete("/partners/:id", validateJwt, deleteFcmPartner);

module.exports = router;
