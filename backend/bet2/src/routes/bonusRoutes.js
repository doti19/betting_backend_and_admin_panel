const express = require("express");
const router = express.Router();
const bonusController = require("../controllers/bonusController");
const authController = require("../controllers/authController");
router.post("/", authController.protect, authController.restrictTo("superadmin", "admin", "dev_mgmt"), bonusController.registerBonus);
router.get("/", bonusController.getAllBonuses);
router.get("/mobile", bonusController.getBonusesForMob);

router.get("/:id", bonusController.getSingleBonus);
router.patch("/:id", authController.protect, authController.restrictTo("superadmin", "admin", "dev_mgmt"), bonusController.updateBonus);
router.delete("/:id", authController.protect, authController.restrictTo("superadmin", "admin", "dev_mgmt"), bonusController.deleteBonus);
module.exports = router;