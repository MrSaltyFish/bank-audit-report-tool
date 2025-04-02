const Observations = require("../models/Observations.model");

addQuery = async (req, res) => {
  const { accountNo, query, details, masterDatabase } = req.body;

  try {
    const newQuery = new Observations({
      accountNo,
      query,
      details,
      masterDatabase,
    });
    await newQuery.save();
    res.send("Query added successfully");
  } catch (err) {
    console.error("Error adding query:", err);
    res.status(500).send("Failed to add query");
  }
};

reportsQuery = async (req, res) => {
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
