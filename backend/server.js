require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const logger = require("./utils/logger");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bankRoutes = require("./routes/bankRoutes");
const masterRoutes = require("./routes/masterRoutes");
const queriesRoutes = require("./routes/queriesRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URI = `${process.env.FRONTEND_URI}` || "http://localhost:5173";

console.log(`\nFRONTEND_URI: ${FRONTEND_URI}\nPORT: ${PORT}\n`);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security Middleware, applied to all routes
app.use(limiter);
app.use(express.json());
app.use(cors({ origin: FRONTEND_URI, credentials: true }));

app.use(helmet());
app.use(mongoSanitize({ replaceWith: "_" }));

// Basic Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Debug Logger
app.use((req, res, next) => {
  logger.debug(
    `Incoming request to ${req.method} ${req.originalUrl} from IP ${req.ip}`
  );
  next();
});

// Database Connection
connectDB();

// Home Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "backend-home.html"));
});

app.use("/auth", authRoutes);
app.use("/bank", bankRoutes);
app.use("/master", masterRoutes);
app.use("/query", queriesRoutes);
app.use("/report", reportRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/test", async (req, res) => {
  return res.json({ success: true, message: "Test Route successful" });
});
