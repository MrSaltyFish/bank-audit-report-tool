const express = require("express");
const { generateReport } = require("../controllers/reportController");
const router = express.router();

router.get("/generate-report", generateReport);

module.exports = router;
