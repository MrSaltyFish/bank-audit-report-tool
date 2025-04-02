const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const saltRounds = 10;

  console.log(
    `Request received on /signup\nusername: ${username}\temail: ${email}\tpassword: ${password}`
  );

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Account already registered with this email" });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, email, password: hash });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Request received on /login");

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Username or password is incorrect.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.json({ success: true, message: "Login successful" });
    } else {
      return res.status(401).json({
        success: false,
        message: "Username or password is incorrect.",
      });
    }
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { signup, login };
