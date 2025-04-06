const Observations = require("../models/Observations.model");
const MasterDatabase = require("../models/MasterDatabase.model");
const logger = require("../utils/logger");

const addQuery = async (req, res) => {
  const { accountNo, query, details, masterDatabase } = req.body;

  logger.info(
    `Incoming request to /add-query for accountNo: ${accountNo} from IP: ${req.ip}`
  );

  if (!accountNo || !query || !masterDatabase) {
    logger.warn(
      `Missing required fields in addQuery from IP: ${req.ip} — accountNo: ${accountNo}, query: ${query}, masterDatabase: ${masterDatabase}`
    );
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const newQuery = new Observations({
      accountNo,
      query,
      details,
      masterDatabase,
    });

    await newQuery.save();

    logger.info(
      `New query added for accountNo: ${accountNo} | Query: "${query}" from IP: ${req.ip}`
    );

    res.json({ success: true, message: "Query added successfully" });
  } catch (err) {
    logger.error(
      "Error adding query for accountNo %s from IP %s: %o",
      accountNo,
      req.ip,
      err
    );
    res.status(500).json({
      success: false,
      message: "Failed to add query",
      error: err.message,
    });
  }
};

const reportsQuery = async (req, res) => {
  const { bankID } = req.query;

  logger.info(
    `Request to /reports-query for bankID: ${bankID} from IP: ${req.ip}`
  );

  if (!bankID) {
    logger.warn(`Missing bankID in reportsQuery request from IP: ${req.ip}`);
    return res
      .status(400)
      .json({ success: false, message: "Bank ID is required" });
  }

  try {
    const results = await MasterDatabase.find({ bank: bankID }).populate(
      "bank"
    );

    logger.info(
      `Reports fetched for bankID: ${bankID} — ${results.length} entries found`
    );

    res.json(results);
  } catch (err) {
    logger.error(
      "Error fetching reports for bankID %s from IP %s: %o",
      bankID,
      req.ip,
      err
    );
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reports" });
  }
};

module.exports = { addQuery, reportsQuery };
