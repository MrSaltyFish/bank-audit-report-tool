const Bank = require("../models/Bank.model");
const logger = require("../utils/logger");

const addBank = async (req, res) => {
  const { bankName, branchName, branchLocation } = req.body;

  logger.info(`Incoming request to /add-bank from IP: ${req.ip}`);

  if (!bankName || !branchName || !branchLocation) {
    logger.warn(
      `Missing fields in /add-bank request from IP: ${req.ip} — bankName: ${bankName}, branchName: ${branchName}, branchLocation: ${branchLocation}`
    );
    return res.status(400).json({
      success: false,
      message: "Bank Name, Branch Name, and Branch Location are required",
    });
  }

  try {
    const newBank = new Bank({ bankName, branchName, branchLocation });
    await newBank.save();
    logger.info(
      `New bank added from IP: ${req.ip} — ${bankName}, ${branchName}, ${branchLocation}`
    );
    res.status(201).json({
      success: true,
      message: "Bank and Branch added successfully",
    });
  } catch (err) {
    logger.error("Error adding bank or branch: %o", err);
    res.status(500).json({ success: false, message: "Failed to add bank" });
  }
};

const getBank = async (req, res) => {
  const { bankId } = req.body;

  logger.info(`Incoming request to /get-bank from IP: ${req.ip}`);

  if (!bankId) {
    logger.warn(`Missing bankId in /get-bank request from IP: ${req.ip}`);
    return res.status(400).json({
      success: false,
      message: "Bank ID is required",
    });
  }

  try {
    const bank = await Bank.findById(bankId);

    if (!bank) {
      logger.info(`Bank not found for ID ${bankId} from IP: ${req.ip}`);
      return res.status(404).json({
        success: false,
        message: "Bank not found",
      });
    }

    logger.info(`Bank retrieved for ID ${bankId} from IP: ${req.ip}`);
    res.json(bank);
  } catch (err) {
    logger.error("Error fetching bank: %o", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error: Failed to fetch bank",
    });
  }
};

const getBanks = async (req, res) => {
  logger.info(`Incoming request to /get-banks from IP: ${req.ip}`);

  try {
    const banks = await Bank.find();
    logger.info(
      `Total banks returned: ${banks.length} — Request IP: ${req.ip}`
    );
    res.json(banks);
  } catch (err) {
    logger.error("Error fetching banks and branches: %o", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error: Failed to fetch banks",
    });
  }
};

const deleteBank = async (req, res) => {
  const { id } = req.params;

  logger.info(`Request to delete bank with ID ${id} from IP: ${req.ip}`);

  try {
    await Bank.findByIdAndDelete(id);
    logger.info(`Bank with ID ${id} deleted by IP: ${req.ip}`);
    res.json({ success: true, message: "Bank deleted successfully" });
  } catch (err) {
    logger.error("Error deleting bank: %o", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete bank",
    });
  }
};

module.exports = { addBank, getBank, getBanks, deleteBank };
