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
  createDog,
  getAllDogs,
  getDog,
  updateDog,
  deleteDog,
  createFcmPackage,
  getAllFcmPackages,
  getFcmPackage,
  updateFcmPackage,
  deleteFcmPackage,
  createFcmTransfer,
  getAllFcmTransfers,
  getFcmTransfer,
  updateFcmTransfer,
  deleteFcmTransfer,
} = require("../controllers/fcmController");
const { getLogs } = require("../controllers/userLogController");
const { fieldValidator } = require("../middlewares/fieldValidator");

const { validateJwt } = require("../middlewares/validateJwt");
const router = Router();

/************ CRUD PARTNERS********* */
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

/************ CRUD DOGS********* */
router.post("/dogs/", validateJwt, createDog);
router.get("/dogs/", validateJwt, getAllDogs);
router.get("/dogs/:id", validateJwt, getDog);
router.put("/dogs/:id", validateJwt, updateDog);
router.delete("/dogs/:id", validateJwt, deleteDog);

/************ PACKAGES ********* */
router.post("/fcmPackages/", validateJwt, createFcmPackage);
router.get("/fcmPackages/", validateJwt, getAllFcmPackages);
router.get("/fcmPackages/:id", validateJwt, getFcmPackage);
router.put("/fcmPackages/:id", validateJwt, updateFcmPackage);
router.delete("/fcmPackages/:id", validateJwt, deleteFcmPackage);

/************ TRANSFER ********* */
router.post("/fcmTransfers/", validateJwt, createFcmTransfer);
router.get("/fcmTransfers/", validateJwt, getAllFcmTransfers);
router.get("/fcmTransfers/:id", validateJwt, getFcmTransfer);
router.put("/fcmTransfers/:id", validateJwt, updateFcmTransfer);
router.delete("/fcmTransfers/:id", validateJwt, deleteFcmTransfer);

module.exports = router;
