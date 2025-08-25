const express = require("express");
const {
  generateReport,
  generatePdfReport,
  generateDocxReport,
} = require("../controllers/reportController");

const router = express.Router();

router.post("/generate-report", generateReport);
router.post("/generate-pdf-report", generatePdfReport);
router.post("/generate-sample-docx", generateDocxReport);

module.exports = router;
