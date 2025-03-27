const mongoose = require('mongoose');

const masterDatabaseSchema = new mongoose.Schema({
    bank: { type: mongoose.Schema.Types.ObjectId, ref: 'Bank', required: true },
    accountNo: { type: String, unique: true, required: true },
    nameOfBorrower: { type: String },
    dateOfSanctionRenewal: { type: Date },
    sanctionedAmount: { type: Number },
    outstandingBalance: { type: Number },
    otherFacilities: { type: String }
});

const MasterDatabase = mongoose.model('MasterDatabase', masterDatabaseSchema);
module.exports = MasterDatabase;
