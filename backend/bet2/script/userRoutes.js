const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
router.get("/countDocuments", authController.protect, authController.restrictTo("superadmin", "admin"), userController.countDocuments);
router.post("/devTeam/login", authController.devTeamLogin);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.get("/profile", authController.protect, authController.restrictTo("user", "admin", "superadmin", "dev_mgmt"), userController.getMe);
router.patch("/updateMyPassword", authController.protect, authController.restrictTo("admin", "superadmin", "dev_mgmt"), authController.updatePassword);
router.patch("/updateProfile", authController.protect, authController.restrictTo("admin", "superadmin", "dev_mgmt"), userController.updateProfile);
router.delete("/deleteProfile", authController.protect, authController.restrictTo("admin", "superadmin", "dev_mgmt"), userController.deleteProfile);
router.get("/", authController.protect, authController.restrictTo("admin", "superadmin", "dev_mgmt"), userController.getAllUsers);
router.get("/:id", authController.protect, authController.restrictTo("superadmin", "dev_mgmt"), userController.getSingleUser);
router.patch("/:id", authController.protect, authController.restrictTo("superadmin", "dev_mgmt"), userController.updateUser);
router.delete("/:id", authController.protect, authController.restrictTo("superadmin", "dev_mgmt"), userController.deleteUser);
module.exports = router;