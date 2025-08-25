const MasterDatabase = require("../models/MasterDatabase.model");
const Observations = require("../models/Observations.model");
const logger = require("../utils/logger");

const createEntry = async (req, res) => {
  const {
    bankID,
    accountNo,
    nameOfBorrower,
    dateOfSanctionRenewal,
    sanctionedAmount,
    outstandingBalance,
    otherFacilities,
  } = req.body;

  logger.info(`Incoming request to /create-entry from IP: ${req.ip}`);

  if (!bankID) {
    logger.warn(`Missing bankID in createEntry request from IP: ${req.ip}`);
    return res
      .status(400)
      .json({ success: false, message: "Bank ID is required" });
  }

  try {
    const existingEntry = await MasterDatabase.findOne({ accountNo });

    if (existingEntry) {
      logger.warn(
        `Duplicate entry attempt for accountNo: ${accountNo} from IP: ${req.ip}`
      );
      return res.status(409).json({
        success: false,
        message: "Entry already exists with this account number",
      });
    }

    const newEntry = new MasterDatabase({
      bank: bankID,
      accountNo,
      nameOfBorrower,
      dateOfSanctionRenewal,
      sanctionedAmount,
      outstandingBalance,
      otherFacilities,
    });

    await newEntry.save();

    logger.info(
      `New master entry created for accountNo: ${accountNo} under bankID: ${bankID} by IP: ${req.ip}`
    );

    res.json({ success: true, message: "Entry created successfully" });
  } catch (err) {
    logger.error("Error creating entry in MasterDatabase: %o", err);
    res.status(500).json({ success: false, message: "Failed to create entry" });
  }
};

const getDetails = async (req, res) => {
  const { accountNo } = req.body;

  logger.info(
    `Incoming request to /get-details for accountNo: ${accountNo} from IP: ${req.ip}`
  );

  try {
    const observations = await Observations.find({ accountNo }).populate(
      "accountNo"
    );

    logger.info(
      `Fetched ${observations.length} observation(s) for accountNo: ${accountNo} from IP: ${req.ip}`
    );

    res.json(observations);
  } catch (err) {
    logger.error("Error fetching details for accountNo %s: %o", accountNo, err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch details" });
  }
};

const getAllDetails = async (req, res) => {
  const { bankId } = req.query;

  logger.info(
    `Incoming request to /get-all-details for bankId: ${bankId} from IP: ${req.ip}`
  );

  if (!bankId) {
    logger.warn(`Missing bankId in getAllDetails request from IP: ${req.ip}`);
    return res
      .status(400)
      .json({ success: false, message: "Bank ID is required" });
  }

  try {
    const entries = await MasterDatabase.find({ bank: bankId }).populate(
      "bank",
      "bankName branchName branchLocation"
    );

    logger.info(
      `Returned ${entries.length} master entries for bankId: ${bankId} from IP: ${req.ip}`
    );

    res.json(entries);
  } catch (error) {
    logger.error("Error fetching entries for bankId %s: %o", bankId, error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { createEntry, getDetails, getAllDetails };
