const SERVER_URL = import.meta.env.VITE_SERVER_URL;

import "./auth.js";

// Function to get URL parameters
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Autofill the Bank ID from the URL
document.addEventListener("DOMContentLoaded", () => {

  const bankID = getUrlParameter("bankId"); // Adjust this parameter name if needed
  console.log("Bank ID is " + bankID);
  if (bankID) {
    document.getElementById("bankID").value = bankID;
  }

  // Attach event listener for generating report
  const generateReportLink = document.querySelector(
    'a[href="#generate-report"]'
  );
  if (generateReportLink) {
    generateReportLink.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedBankID = document.getElementById("bankID").value;
      if (!selectedBankID) {
        alert("Please select a bank to generate the report.");
        return;
      }
      generateReport(selectedBankID);
    });
  }
});

// Crate Entry
document.getElementById("addDataForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    bankID: document.getElementById("bankID").value,
    accountNo: document.getElementById("accountNo").value,
    nameOfBorrower: document.getElementById("nameOfBorrower").value,
    dateOfSanctionRenewal: document.getElementById("dateOfSanctionRenewal").value,
    sanctionedAmount: parseFloat(document.getElementById("sanctionedAmount").value),
    outstandingBalance: parseFloat(document.getElementById("outstandingBalance").value),
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
document.getElementById("addQueryForm").addEventListener("submit", async (e) => {
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
document.getElementById("getDetailsForm").addEventListener("submit", async (e) => {
  e.preventDefault();

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
    outputDiv.innerHTML = `
  <h4>Account Details</h4>
  ${
    data.length === 0
      ? "<p>No details found for this account.</p>"
      : `<pre>${JSON.stringify(data, null, 2)}</pre>`
  }
`;

  } catch (err) {
    console.error("Error fetching details:", err);
    alert("Error fetching account details.");
  }
});



// Function to generate a report
async function generateReport(bankId) {
  try {
    const response = await fetch(`${SERVER_URL}/report/generate-report`, {
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
