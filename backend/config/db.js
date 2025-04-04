const mongoose = require("mongoose");
require("dotenv").config();

MONGO_URI = process.env.MONGO_URI || process.env.LOCAL_MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined. Check your .env file.");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected to: ${MONGO_URI}`);
  } catch (err) {
    console.error("MONGO_URI:", MONGO_URI);
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connectDB;
