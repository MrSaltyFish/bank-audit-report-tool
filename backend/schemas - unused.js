
// Define Mongoose Schemas and Models
const bankSchema = new mongoose.Schema({
    bankName: { type: String, required: true },
    branchName: { type: String, required: true },
    branchLocation: { type: String, required: true }
});

const masterDatabaseSchema = new mongoose.Schema({
    bank: { type: mongoose.Schema.Types.ObjectId, ref: 'Bank', required: true },
    accountNo: { type: String, unique: true, required: true },
    nameOfBorrower: { type: String },
    dateOfSanctionRenewal: { type: Date },
    sanctionedAmount: { type: Number },
    outstandingBalance: { type: Number },
    otherFacilities: { type: String }
});

const observationsSchema = new mongoose.Schema({
    accountNo: { type: String, required: true },
    query: { type: String },
    details: { type: String },
    masterDatabase: { type: mongoose.Schema.Types.ObjectId, ref: 'MasterDatabase' }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Create Models
const Bank = mongoose.model('Bank', bankSchema);
const MasterDatabase = mongoose.model('MasterDatabase', masterDatabaseSchema);
const Observations = mongoose.model('Observations', observationsSchema);
const User = mongoose.model('User', userSchema);

