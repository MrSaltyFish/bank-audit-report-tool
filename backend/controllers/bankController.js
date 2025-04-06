const Bank = require("../models/Bank.model");

// const addBank = async (req, res) => {
//   const { bankName, branchName, branchLocation } = req.body;
//   try {
//     const newBank = new Bank({ bankName, branchName, branchLocation });
//     await newBank.save();
//     res.status(201).json({ message: "Bank added successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to add bank" });
//   }
// };

const addBank = async (req, res) => {
  console.log("Request on /add-bank");
  const { bankName, branchName, branchLocation } = req.body;

  if (!bankName || !branchName || !branchLocation) {
    return res
      .status(400)
      .send("Bank Name, Branch Name, and Branch Location are required");
  }

  try {
    const newBank = new Bank({ bankName, branchName, branchLocation });
    await newBank.save();
    res.status(201).json({ message: "Bank and Branch added successfully" });
  } catch (err) {
    console.error("Error adding bank or branch:", err);
    return res.status(500).json({ message: "Failed to add bank" });
  }
};

const getBank = async (req, res) => {
  const { bankId } = req.body;

  if (!bankId) {
    return res.status(400).json({
      success: false,
      message: "Bank ID is required",
    });
  }

  try {
    const bank = await Bank.findById(bankId);

    if (!bank) {
      return res.status(404).json({
        success: false,
        message: "Bank not found",
      });
    }

    res.json(bank);
  } catch (err) {
    console.error("Error fetching bank:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Failed to fetch bank",
    });
  }
};

const getBanks = async (req, res) => {
  try {
    const banks = await Bank.find();
    res.json(banks);
  } catch (err) {
    console.error("Error fetching banks and branches:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Failed to fetch banks",
    });
  }
};

const deleteBank = async (req, res) => {
  const { id } = req.params;
  try {
    await Bank.findByIdAndDelete(id);
    res.json({ success: true, message: "Bank deleted successfully" });
  } catch (err) {
    console.error("Error deleting bank:", err);
    res.status(500).send("Failed to delete bank");
  }
};

module.exports = { addBank, getBank, getBanks, deleteBank };
