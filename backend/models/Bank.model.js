const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  branchName: { type: String, required: true },
  branchLocation: { type: String, required: true },
});

module.exports = mongoose.model("Bank", bankSchema);
