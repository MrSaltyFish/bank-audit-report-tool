const MasterDatabase = require("../models/MasterDatabase.model");
const Observations = require("../models/Observations.model");

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

  if (!bankID) {
    return res.status(400).send("Bank ID is required");
  }

  try {
    const existingEntry = await MasterDatabase.findOne({ accountNo });
    if (existingEntry) {
      return res
        .status(409)
        .send("Entry already exists with this account number");
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
    res.json({ message: "Entry created successfully" });
  } catch (err) {
    console.error("Error creating entry in MasterDatabase:", err);
    res.status(500).send("Failed to create entry");
  }
};

const getDetails = async (req, res) => {
  const { accountNo } = req.body;
  console.log("Received accountNo:", accountNo);

  try {
    const observations = await Observations.find({
      accountNo: accountNo,
    }).populate("accountNo");
    res.json(observations);
  } catch (err) {
    console.error("Error fetching details:", err);
    res.status(500).send("Failed to fetch details");
  }
};

const getAllDetails = async (req, res) => {
  const { bankId } = req.query;

  if (!bankId) {
    return res.status(400).json({ error: "Bank ID is required" });
  }

  try {
    const entries = await MasterDatabase.find({ bank: bankId }).populate(
      "bank",
      "bankName branchName branchLocation"
    );

    res.json(entries);
  } catch (error) {
    console.error("Error fetching bank data for bank ID:", bankId, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createEntry, getDetails, getAllDetails };
