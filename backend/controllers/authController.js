const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const logger = require("../utils/logger");

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const saltRounds = 10;

  logger.info(`Signup request from IP ${req.ip} with email: ${email}`);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(
        `Signup attempt from IP ${req.ip} with existing email: ${email}`
      );
      return res.status(409).json({ message: "Account already exists" });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, email, password: hash });
    await newUser.save();
    logger.info(`New user created from IP ${req.ip}: ${newUser.email}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    logger.error(
      "Signup error from IP %s for email %s: %o",
      req.ip,
      email,
      err
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  logger.info(`Login request from IP ${req.ip} for email: ${email}`);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed from IP ${req.ip} - email not found: ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(
        `Login failed from IP ${req.ip} - password mismatch for email: ${email}`
      );
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

    logger.info(`Login successful from IP ${req.ip} for user: ${email}`);
    res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    logger.error("Login error from IP %s for email %s: %o", req.ip, email, err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  logger.info(`Logout request from IP ${req.ip}`);
  res.clearCookie("jwtToken");
  res.json({ success: true, message: "Logged out successfully" });
};

const checkAuth = (req, res) => {
  console.log("req.user:", req.user);
  try {
    if (!req.user) {
      logger.warn(`Unauthenticated request from IP: ${req.ip}`);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User NOT authenticated",
      });
    }

    logger.info(`Authenticated user ${req.user.email} from IP ${req.ip}`);

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
    logger.error("Error in checkAuth from IP %s: %o", req.ip, error);
    res.status(500).json({
      success: false,
      message: "Internal server error while checking authentication",
    });
  }
};

const testUser = (req, res) => {
  logger.info(
    `Sanitization test hit from IP ${req.ip}. Request body: %o`,
    req.body
  );
  res.status(200).json({
    success: true,
    sanitizedData: req.body,
  });
};

module.exports = { signup, login, logout, checkAuth, testUser };
