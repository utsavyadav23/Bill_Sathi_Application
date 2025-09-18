const express = require("express");
const {
  addAppUser,
  getAppUserSettings,
  recentActivity,
} = require("../controllers/appUserController");
const router = express.Router();

router.post("/settings", addAppUser);
router.get("/settings", getAppUserSettings);
router.get("/latest", recentActivity);

module.exports = router;
