const SERVER_URL = import.meta.env.VITE_SERVER_URL;

import "./auth.js";

console.log("Script loaded");

// Function to get URL parameters
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

let storedBankID = null;

document.addEventListener("DOMContentLoaded", async () => {
  const bankID = getUrlParameter("bankId");
  storedBankID = bankID; // Store for later use in payload
  console.log("Bank ID is " + bankID);

  if (bankID) {
    try {
      const res = await fetch(`${SERVER_URL}/bank/get-bank`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankId: bankID }),
      });

      if (!res.ok) throw new Error("Failed to fetch bank name");

      const data = await res.json();
      const bankName = data.bankName || "Unknown Bank";

      document.getElementById(
        "bankNameHeading"
      ).innerHTML = `Create Entry - <strong>${bankName}</strong>`;
    } catch (err) {
      console.error("Error fetching bank name:", err);
      document.getElementById(
        "bankNameHeading"
      ).innerHTML = `Create Entry - <strong>Bank ID: ${bankID}</strong>`;
    }
  }

  // Event listener for report generation stays here...
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(`${SERVER_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Logout failed");
    localStorage.removeItem("jwtToken");
    window.location.href = "login.html";
  } catch (err) {
    console.error("Logout error:", err);
    alert("Error logging out. Try again.");
  }
});

// Crate Entry
document.getElementById("addDataForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    bankID: document.getElementById("bankID").value,
    accountNo: document.getElementById("accountNo").value,
    nameOfBorrower: document.getElementById("nameOfBorrower").value,
    dateOfSanctionRenewal: document.getElementById("dateOfSanctionRenewal")
      .value,
    sanctionedAmount: parseFloat(
      document.getElementById("sanctionedAmount").value
    ),
    outstandingBalance: parseFloat(
      document.getElementById("outstandingBalance").value
    ),
    otherFacilities: document.getElementById("otherFacilities").value,
  };

  try {
    const res = await fetch(`${SERVER_URL}/master/create-entry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create entry");

    alert("Entry created successfully!");
    e.target.reset();
  } catch (err) {
    console.error("Error creating entry:", err);
    alert("Error creating entry.");
  }
});

// Add QUery
document
  .getElementById("addQueryForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      accountNo: document.getElementById("accountNoObservation").value,
      query: document.getElementById("query").value,
      details: document.getElementById("details").value,
    };

    try {
      const res = await fetch(`${SERVER_URL}/query/add-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add query: " + res.message);

      alert("Query added successfully!");
      e.target.reset();
    } catch (err) {
      console.error("Error adding query:", err);
      alert("Error adding query: " + err);
    }
  });

// get-details
document
  .getElementById("getDetailsForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    const accountNo = document.getElementById("accountNoToFetch").value;

    try {
      const res = await fetch(`${SERVER_URL}/master/get-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNo }),
      });

      if (!res.ok) throw new Error("Failed to fetch details");

      const data = await res.json();

      // Display the result
      const outputDiv = document.getElementById("detailsOutput");
      outputDiv.innerHTML = "<h4>Account Details</h4>";

      if (data.length === 0) {
        outputDiv.innerHTML += "<p>No details found for this account.</p>";
      } else {
        data.forEach((item) => {
          const card = document.createElement("div");
          card.className = "card p-3 mb-3 shadow-sm";
          card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">Account No: ${item.accountNo}</h5>
        <p class="card-text"><strong>Query:</strong> ${item.query}</p>
        <p class="card-text"><strong>Details:</strong> ${item.details}</p>
        <p class="card-text text-muted"><small>ID: ${item._id}</small></p>
      </div>
    `;
          outputDiv.appendChild(card);
        });
      }
    } catch (err) {
      console.error("Error fetching details:", err);
      alert("Error fetching account details.");
    }
  });

// Function to generate a report
async function generateReport(bankId) {
  try {
    const response = await fetch(`${SERVER_URL}/report/generate-report`, {
      // const response = await fetch(`${SERVER_URL}/report/generate-sample-docx`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bankId, format: "word" }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate report");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Report_Bank_${bankId}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("Error generating report:", error);
    alert("Error generating report. Please try again.");
  }
}
