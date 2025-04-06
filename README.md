# 💼 Bank Audit Report Tool

A secure and scalable full-stack web application for managing and tracking bank account audits, built with the MERN stack and designed with resilience against cyberattacks.

---

## 📚 Table of Contents

- [🔍 Overview](#-overview)
- [📁 Folder Structure](#-folder-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [📌 Features](#-features)
- [🧠 Security Considerations](#-security-considerations)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🔍 Overview

This tool helps banks and auditors:

- Manage and register multiple banks
- Track user accounts within banks
- Log and view audit queries per account
- Enhance security through structured role access

It aligns with the capstone project goal of **"Designing a framework to enhance resilience against cyberattacks in critical systems"** by applying secure system architecture principles.

---

## 📁 Folder Structure

```
bank-audit-report-tool/
├── backend/                         # Express.js backend
│   ├── controllers/                 # Request handling logic
│   ├── middleware/                 # Custom middlewares (e.g., auth)
│   ├── config/                      # Configuration files (DB connection, etc.)
│   ├── routes/                      # API route handlers
│   ├── models/                      # Mongoose schema definitions
│   ├── server.js                    # Entry point of the Express server
│   └── .env                         # Environment variables for backend
│
├── frontend/                        # React.js frontend
│   ├── public/                      # Static assets (index.html, favicon, etc.)
│   ├── src/                         # React components, pages, utils
│   ├── package.json                 # Frontend dependencies and scripts
│   └── package-lock.json            # Exact versions of installed packages
│
├── README.md                        # Project documentation
└── .gitignore                       # Ignore list for version control
```

---

## 🛠️ Tech Stack

**Frontend**

- HTML, CSS, JavaScript
- Bootstrap/Tailwind (optional)

**Backend**

- Node.js + Express.js
- MongoDB + Mongoose

**Security**

- Helmet.js
- bcrypt (for password hashing)
- Winston (logger)
- CORS (for cross origin)
- express-rate-limiter (for rate limiting)
- dotenv for environment secrets
---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MrSaltyFish/bank-audit-report-tool.git
cd bank-audit-report-tool
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file as shown below.

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

### 4. Run the App

- Start the backend:

```bash
cd ../backend
node server.js
```

- Start the frontend:

```bash
cd ../frontend
npm start
```

Frontend will run at `http://localhost:3000`, and backend at `http://localhost:5000` (or configured port).

---

## ⚙️ Environment Variables

In the `backend/` directory, create a `.env` file and add:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
SECRET_KEY=your_secure_secret
```

> 🔐 **Note**: Never commit your `.env` file to version control.

---

## 📌 Features

- ✅ Register and manage banks
- ✅ Create and manage bank accounts
- ✅ Log audit queries per account
- ✅ Modular full-stack architecture
- ✅ Basic role-based access support (planned)

---

## 🧠 Security Considerations

This project implements foundational principles of a secure web app:

- ❗ Input validation on all routes
- 🔐 Password hashing using `bcrypt`
- 🯡 Route-level access control (planned for RBAC)
- 🚧 JWT-based authentication readiness
- 🔒 Data access separation (per account/bank)

> These align with best practices for cyber-resilience in critical systems.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/xyz`)
3. Commit your changes (`git commit -m 'Add xyz'`)
4. Push to the branch (`git push origin feature/xyz`)
5. Open a pull request 🚀

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---
