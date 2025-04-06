const express = require("express");
const {
  addBank,
  getBanks,
  getBank,
  deleteBank,
} = require("../controllers/bankController");

const router = express.Router();

router.post("/add-bank", addBank);
router.post("/get-bank", getBank);
router.get("/get-banks", getBanks);
router.delete("/delete-bank/:id", deleteBank);

module.exports = router;
