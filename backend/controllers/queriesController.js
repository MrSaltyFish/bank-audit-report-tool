const Observations = require("../models/Observations.model");
const MasterDatabase = require("../models/MasterDatabase.model");
const logger = require("../utils/logger");

const addQuery = async (req, res) => {
  const { accountNo, query, details, masterDatabase } = req.body;

  try {
    const newQuery = new Observations({
      accountNo,
      query,
      details,
      masterDatabase,
    });
    await newQuery.save();
    res.json({ message: "Query added successfully" });
  } catch (err) {
    console.error("Error adding query:", err);
    res.status(500).json({
      message: "Failed to add query",
      error: err.message,
    });
  }
};

const reportsQuery = async (req, res) => {
  const { bankID } = req.query;
  try {
    const results = await MasterDatabase.find({ bank: bankID }).populate(
      "bank"
    );
    res.json(results);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).send("Failed to fetch reports");
  }
};

module.exports = { addQuery, reportsQuery };
