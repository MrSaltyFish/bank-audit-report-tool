const express = require("express");
const {
  addBank,
  getBanks,
  getDetails,
  deleteBank,
} = require("../controllers/bankController");

const router = express.Router();

router.post("/add-bank", addBank);
router.get("/get-banks", getBanks);
router.delete("/delete-bank/:id", deleteBank);

module.exports = router;
