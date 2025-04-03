require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const path = require("path");
const helmet = require("helmet");

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

// Security Middleware
// app.use(cors({ origin: FRONTEND_URI, credentials: true }));
app.use(cors({ origin: FRONTEND_URI, credentials: true }));
app.use(helmet());

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

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

// // ============ MongoDB ============
// if (!MONGO_URI) {
//   console.error("❌ MONGO_URI is not defined. Check your .env file.");
//   process.exit(1);
// }

// mongoose
//   //   .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .connect(MONGO_URI)
//   .then(() => console.log("MongoDB Connected..."))
//   .catch((err) => {
//     console.error("MONGO_URI:", MONGO_URI);
//     console.error("MongoDB connection error:", err);
//   });

// ============== Routes =================

// Signup Route
// app.post("/signup", async (req, res) => {
//   const { username, email, password } = req.body;
//   const saltRounds = 10;

//   console.log(
//     `Request received on /signup\nusername: ${username}\temail: ${email}\tpassword: ${password}`
//   );

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(409)
//         .json({ message: "Account already registered with this email" });
//     }

//     const hash = await bcrypt.hash(password, saltRounds);
//     const newUser = new User({ username, email, password: hash });
//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error("Error during signup:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// Login Route
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   console.log("Request received on /login");

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "Username or password is incorrect.",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (isMatch) {
//       return res.json({ success: true, message: "Login successful" });
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: "Username or password is incorrect.",
//       });
//     }
//   } catch (err) {
//     console.error("Error during login:", err);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal Server Error" });
//   }
// });

// // Add Bank and Branch Route
// app.post("/add-bank", async (req, res) => {
//   console.log("Request on /add-bank");
//   const { bankName, branchName, branchLocation } = req.body;

//   if (!bankName || !branchName || !branchLocation) {
//     return res
//       .status(400)
//       .send("Bank Name, Branch Name, and Branch Location are required");
//   }

//   try {
//     const newBank = new Bank({ bankName, branchName, branchLocation });
//     await newBank.save();
//     // res.json({ success: true, message: 'Bank and Branch added successfully' });
//     res.status(201).json({ message: "Bank and Branch added successfully" });
//   } catch (err) {
//     console.error("Error adding bank or branch:", err);
//     return res.status(500).send("Failed to add bank/branch");
//   }
// });

// Create entry in MasterDatabase
// app.post("/create-entry", async (req, res) => {
//   const {
//     bankID,
//     accountNo,
//     nameOfBorrower,
//     dateOfSanctionRenewal,
//     sanctionedAmount,
//     outstandingBalance,
//     otherFacilities,
//   } = req.body;

//   if (!bankID) {
//     return res.status(400).send("Bank ID is required");
//   }

//   try {
//     const existingEntry = await MasterDatabase.findOne({ accountNo });
//     if (existingEntry) {
//       return res
//         .status(409)
//         .send("Entry already exists with this account number");
//     }

//     const newEntry = new MasterDatabase({
//       bank: bankID,
//       accountNo,
//       nameOfBorrower,
//       dateOfSanctionRenewal,
//       sanctionedAmount,
//       outstandingBalance,
//       otherFacilities,
//     });
//     await newEntry.save();
//     res.send("Entry created successfully");
//   } catch (err) {
//     console.error("Error creating entry in MasterDatabase:", err);
//     res.status(500).send("Failed to create entry");
//   }
// });

// Add observation
// app.post("/add-query", async (req, res) => {
//   const { accountNo, query, details, masterDatabase } = req.body;

//   try {
//     const newQuery = new Observations({
//       accountNo,
//       query,
//       details,
//       masterDatabase,
//     });
//     await newQuery.save();
//     res.send("Query added successfully");
//   } catch (err) {
//     console.error("Error adding query:", err);
//     res.status(500).send("Failed to add query");
//   }
// });

// // Generate report for a specific bank
// app.get("/reports", async (req, res) => {
//   const { bankID } = req.query;
//   try {
//     const results = await MasterDatabase.find({ bank: bankID }).populate(
//       "bank"
//     );
//     res.json(results);
//   } catch (err) {
//     console.error("Error fetching reports:", err);
//     res.status(500).send("Failed to fetch reports");
//   }
// });

// Fetch Banks
// app.get("/api/banks", async (req, res) => {
//   try {
//     const results = await Bank.find();
//     res.json(results);
//   } catch (error) {
//     console.error("Error fetching banks:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Get all banks and branches for the dashboard
// app.get("/get-banks", async (req, res) => {
//   try {
//     const results = await Bank.find();
//     res.json(results);
//   } catch (err) {
//     console.error("Error fetching banks and branches:", err);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal Server Error" });
//   }
// });

// Delete Bank Route
// app.delete("/delete-bank/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Bank.findByIdAndDelete(id);
//     res.json({ success: true, message: "Bank deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting bank:", err);
//     res.status(500).send("Failed to delete bank");
//   }
// });

// // Get details of observations for a specific bank
// app.get("/get-details", async (req, res) => {
//   const { accountNo } = req.query;

//   try {
//     const observations = await Observations.find({
//       accountNo: accountNo,
//     }).populate("accountNo");
//     res.json(observations);
//   } catch (err) {
//     console.error("Error fetching details:", err);
//     res.status(500).send("Failed to fetch details");
//   }
// });

// app.get("/getall-details", async (req, res) => {
//   const { bankId } = req.query; // Get the bankId from the query parameters

//   if (!bankId) {
//     return res.status(400).json({ error: "Bank ID is required" });
//   }

//   try {
//     const entries = await MasterDatabase.find({ bank: bankId }) // Filter by bank ID
//       .populate("bank", "bankName branchName branchLocation"); // Populate bank details

//     res.json(entries);
//   } catch (error) {
//     console.error("Error fetching bank data for bank ID:", bankId, error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// async function generateReport(bankId, format) {
//   const bankData = await Bank.findById(bankId);
//   if (!bankData) {
//     throw new Error("Bank not found");
//   }

//   const masterData = await MasterDatabase.find({ bank: bankId });
//   const observationData = await Observations.find({
//     accountNo: { $in: masterData.map((entry) => entry.accountNo) },
//   });

//   let reportBuffer;

//   if (format === "pdf") {
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage();
//     let reportContent = `Report for Bank Name: ${bankData.bankName}\n`;

//     reportContent += "Bank Details:\n";
//     reportContent += `Bank Name: ${bankData.bankName}\n`;
//     reportContent += "Branches:\n";
//     reportContent += ` - ${bankData.branchName}, Location: ${bankData.branchLocation}\n`;

//     reportContent += "\nMaster Database Entries:\n";
//     masterData.forEach((entry) => {
//       reportContent += ` - Account No: ${entry.accountNo}, Name: ${entry.nameOfBorrower}, Amount: ${entry.sanctionedAmount}\n`;
//     });

//     reportContent += "\nObservations:\n";
//     observationData.forEach((obs) => {
//       reportContent += ` - Query: ${obs.query}, Details: ${obs.details}\n`;
//     });

//     page.drawText(reportContent, { x: 50, y: page.getHeight() - 50 });
//     reportBuffer = await pdfDoc.save();
//   } else if (format === "word") {
//     let reportContent = `Report for Bank Name: ${bankData.bankName}\n`;
//     reportContent += "Bank Details:\n";
//     reportContent += `Bank Name: ${bankData.bankName}\n`;
//     reportContent += "Branches:\n";
//     reportContent += ` - ${bankData.branchName}, Location: ${bankData.branchLocation}\n`;

//     reportContent += "\nMaster Database Entries:\n";
//     masterData.forEach((entry) => {
//       reportContent += ` - Account No: ${entry.accountNo}, Name: ${entry.nameOfBorrower}, Amount: ${entry.sanctionedAmount}\n`;

//       // Find observations related to the current master database entry
//       const relatedObservations = observationData.filter(
//         (obs) => obs.accountNo === entry.accountNo
//       );

//       if (relatedObservations.length > 0) {
//         reportContent += "   Observations:\n"; // Indent for better visibility
//         relatedObservations.forEach((obs) => {
//           reportContent += `     - Query: ${obs.query}, Details: ${obs.details}\n`;
//         });
//       } else {
//         reportContent += "   No observations found.\n"; // Handle case with no observations
//       }
//     });

//     reportBuffer = Buffer.from(reportContent, "utf-8");
//   }

//   return reportBuffer;
// }

// // Route for generating the report
// app.get("/generate-report", async (req, res) => {
//   const { bankId, format } = req.query;

//   try {
//     const reportBuffer = await generateReport(bankId, format);

//     if (format === "pdf") {
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
//     } else if (format === "word") {
//       res.setHeader(
//         "Content-Type",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//       );
//       res.setHeader("Content-Disposition", "attachment; filename=report.docx");
//     }

//     res.send(reportBuffer);
//   } catch (error) {
//     console.error("Error generating report:", error);
//     res.status(500).send("Error generating report");
//   }
// });
