const express = require("express");
const {
  signup,
  login,
  logout,
  testUser,
  checkAuth,
} = require("../controllers/authController");

const { verifyJwtToken } = require("../middlewares/verifyJwtToken.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/test-user", testUser);
router.post("/logout", logout);
router.get("/check-auth", verifyJwtToken, checkAuth);

module.exports = router;
