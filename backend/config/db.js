const mongoose = require("mongoose");
require("dotenv").config();

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined. Check your .env file.");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MONGO_URI:", MONGO_URI);
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connectDB;
