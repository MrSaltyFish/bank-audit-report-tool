const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const logger = require("../utils/logger");

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const saltRounds = 10;

  console.log(`Request received on /signup: ${username}, ${email}`);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Account already exists" });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, email, password: hash });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Request received on /login");

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔹 Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔹 Store token in HTTP-Only Cookie (More Secure)
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("jwtToken");
  res.json({ success: true, message: "Logged out successfully" });
};

const checkAuth = (req, res) => {
  try {
    if (!req.user) {
      logger.warn(`Unauthenticated request from IP: ${req.ip}`);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User NOT authenticated",
      });
    }

    logger.info(`User ${req.user.email} is authenticated`);

    res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    logger.error("Error in checkAuth: %o", err);
    res.status(500).json({
      success: false,
      message: "Internal server error while checking authentication",
    });
  }
};

module.exports = { signup, login, logout, checkAuth };
