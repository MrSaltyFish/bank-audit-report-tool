const express = require("express");
const {
  signup,
  login,
  logout,
  checkAuth,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check-auth", authMiddleware, checkAuth);

module.exports = router;
