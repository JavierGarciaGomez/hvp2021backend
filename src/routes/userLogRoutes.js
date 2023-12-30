/* Users routes:
    host/api/authLogs
*/

const { Router } = require("express");
const { getLogs } = require("../controllers/userLogController");

const { validateJwt } = require("../middlewares/validateJwt");
const router = Router();

/************USERS CRUD********* */
// GET ALL USERS
router.get("/", validateJwt, getLogs);

module.exports = router;
