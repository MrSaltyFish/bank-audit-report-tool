const express = require("express");
const {
  createEntry,
  getDetails,
  getAllDetails,
} = require("../controllers/masterController");

const router = express.Router();

router.post("/create-entry", createEntry);
router.post("/get-details", getDetails);
router.get("/getall-details", getAllDetails);

module.exports = router;
