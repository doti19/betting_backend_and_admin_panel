const express = require("express");
const router = express.Router();
const bonusBetController = require("../controllers/bonusBetController");
const authController = require("../controllers/authController");
router.post("/", bonusBetController.checkBonusBet, bonusBetController.createBonusBet);
router.get("/", authController.protect, authController.restrictTo("superadmin", "admin", "dev_mgmt"), bonusBetController.getAllBonusBets);
// router.get("/payedBets", authController.protect, authController.restrictTo("admin", "superadmin", "dev_mgmt"), bonusBetController.viewPayedBets);

router.get("/:id", bonusBetController.getSingleBonusBet);
router.patch("/:id", authController.protect, authController.restrictTo("superadmin", "admin", "dev_mgmt"), bonusBetController.updateBonusBet);

router.patch("/updatestatus/:id", authController.protect, authController.restrictTo("admin", "superadmin", "dev_mgmt"), bonusBetController.updateStatusBonusBet);
module.exports = router;

module.exports = router;