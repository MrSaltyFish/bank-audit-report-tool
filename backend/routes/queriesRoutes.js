const express = require("express");
const { addQuery, reportsQuery } = require("../controllers/queriesController");

const router = express.Router();

router.post("/add-query", addQuery);
router.get("/reports", reportsQuery);

module.exports = router;
