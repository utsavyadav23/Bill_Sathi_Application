const express = require("express");
const {
  addAppUser,
  getAppUserSettings,
} = require("../controllers/appUserController");
const router = express.Router();

router.post("/settings", addAppUser);
router.get("/settings", getAppUserSettings);

module.exports = router;
