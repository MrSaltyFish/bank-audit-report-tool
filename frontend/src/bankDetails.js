const SERVER_URL = import.meta.env.VITE_SERVER_URL;

import "./auth.js";

document.addEventListener("DOMContentLoaded", function () {
  fetchBanks();
});

function fetchBanks() {
  console.log("inside fetchBanks()");
  fetch(`${SERVER_URL}/bank/get-banks`)
    .then((response) => response.json())
    .then((banks) => {
      const bankListDiv = document.getElementById("bankList");
      bankListDiv.innerHTML = banks
        .map(
          (bank) => `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${bank.bankName}</h5>
                        <p class="card-text">Branch: ${bank.branchName}</p>
                        <p class="card-text">Location: ${bank.branchLocation}</p>
                        <button class="btn view-data-btn"
                                style="background-color: #007bff; color: white;"
                                data-bank-id="${bank._id}" 
                                data-bank-name="${bank.bankName}">
                            View Data
                        </button>

                        <button class="btn generate-report-btn" 
                                style="background-color: #28a745; color: white;"
                                data-bank-id="${bank._id}"
                                data-bank-name="${bank.bankName}">
                            Generate Report
                        </button>
                    </div>
                </div>
            `
        )
        .join("");

      document.querySelectorAll(".view-data-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const bankId = this.getAttribute("data-bank-id");
          const bankName = this.getAttribute("data-bank-name");
          fetchBankData(bankId, bankName);
        });
      });

      document.querySelectorAll(".generate-report-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const bankId = this.getAttribute("data-bank-id");
          const bankName = this.getAttribute("data-bank-name");
          generateReport(bankId, bankName);
        });
      });
    })
    .catch((error) => console.error("Error fetching banks:", error));
}

function fetchBankData(bankId, bankName) {
  fetch(`${SERVER_URL}/master/getall-details?bankId=${bankId}`)
    .then((response) => response.json())
    .then((entries) => {
      const bankDataContainer = document.getElementById("bankDataContainer");
      bankDataContainer.innerHTML = entries
        .map(
          (entry) => `
                <div class="card mt-3">
                    <div class="card-body">
                        <h5 class="card-title">Account No: ${entry.accountNo}</h5>
                        <p class="card-text">Bank: ${entry.bank.bankName}</p>
                    </div>
                </div>
            `
        )
        .join("");
      document.getElementById("selectedBankName").textContent =
        "Bank Data for: " + entries[0].bank.bankName;
    })
    .catch((error) => console.error("Error fetching bank data:", error));
}

function generateReport(bankId, bankName) {
  fetch(`${SERVER_URL}/report/generate-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bankId, format: "word" }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Report_${bankName}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((error) => console.error("Error generating report:", error));
}
