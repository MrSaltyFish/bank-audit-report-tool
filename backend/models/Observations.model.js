const mongoose = require("mongoose");

const observationsSchema = new mongoose.Schema({
  accountNo: { type: String, required: true },
  query: { type: String },
  details: { type: String },
  masterDatabase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MasterDatabase",
  },
});

module.exports = mongoose.model("Observations", observationsSchema);
