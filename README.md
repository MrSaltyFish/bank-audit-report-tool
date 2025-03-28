# Bank Audit Report Tool (BART)

## Overview
BART (Bank Audit Report Tool) is a web-based application built using **Node.js, Express, HTML, CSS, and JavaScript**. It generates audit reports for different branches of a bank, detailing account transactions and queries for each account.

## Features
- Generate **detailed audit reports** for different bank branches.
- Retrieve and display **account transaction history**.
- Include all **queries and actions** associated with each account.
- **User-friendly web interface** for report generation and review.
- Secure **role-based access** for auditors and administrators.
- Store and manage audit reports efficiently using **MongoDB**.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v14 or later)
- **MongoDB**
- **npm** (Node Package Manager)

### Clone the Repository
```sh
git clone https://github.com/yourusername/bank-audit-report-tool.git
cd bank-audit-report-tool
```

### Install Dependencies
```sh
npm install
```

### Configure Environment Variables
Create a `.env` file in the root directory and set the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bart_db
```

### Run the Application
```sh
npm start
```
The application will be available at **http://localhost:5000**.

## API Endpoints
| Method | Endpoint | Description |
|--------|------------|-------------|
| GET | `/branches` | Fetch all bank branches |
| GET | `/accounts/:branchId` | Get all accounts in a branch |
| GET | `/account/:accountId` | Retrieve details for a specific account |
| GET | `/report/:accountId` | Generate an audit report for an account |

## Folder Structure
```
📂 bank-audit-report-tool/
├── 📂 public/        # Static files (HTML, CSS, JS)
├── 📂 routes/        # Express route handlers
├── 📂 models/        # MongoDB models
├── 📂 controllers/   # Business logic
├── 📂 views/         # Templates (if using templating engine)
├── server.js        # Main server file
├── package.json     # Project dependencies
├── .env             # Environment variables
└── README.md        # Documentation
```

## Future Enhancements
- Add **PDF export** for audit reports.
- Implement **data analytics and visualization**.
- Enhance security with **OAuth authentication**.

## License
MIT License

---
Developed by [Your Name]

