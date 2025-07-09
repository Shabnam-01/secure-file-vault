const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  register,
  login,
  updateProfile,
  enable2FA,
  verify2FASetup,
  updateTwoFA,
  verify2FALogin
} = require("../controllers/authController");

router.post("/signup", register);
router.post("/login", login);
router.put("/update-profile", auth, updateProfile);

router.post("/verify2fa-login", verify2FALogin);
router.post("/verify2fa-setup", auth, verify2FASetup);

router.post("/enable2fa", auth, enable2FA);
router.post("/settings/twofa", auth, updateTwoFA);

module.exports = router;
