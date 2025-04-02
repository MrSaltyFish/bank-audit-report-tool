const SERVER_URL = process.env.VITE_SERVER_URL;

document.addEventListener("DOMContentLoaded", function () {
  fetchBanks();
});

// function fetchBanks() {
//     fetch(`${SERVER_URL}/get-banks`)
//         .then(response => response.json())
//         .then(banks => {
//             const bankListDiv = document.getElementById('bankList');
//             bankListDiv.innerHTML = banks.map(bank => `
//                 <div class="card">
//                     <div class="card-body">
//                         <h5 class="card-title">${bank.bankName}</h5>
//                         <p class="card-text">Branch: ${bank.branchName}</p>
//                         <p class="card-text">Location: ${bank.branchLocation}</p>
//                         <button class="btn" style="background-color: #007bff; color: white;" onclick="fetchBankData('${bank._id}', '${bank.bankName}')"><a href="#viewdata1" style="color: white; text-decoration: none;">View Data</a></button>
//                         <button class="btn" style="background-color: #007bff; color: white;" onclick="showReportSection('${bank._id}', '${bank.bankName}')"><a href="#generateReportBtn" style="color: white; text-decoration: none;">Generate Report</a></button>

//                     </div>
//                 </div>
//             `).join('');
//         })
//         .catch(error => console.error('Error fetching banks:', error));
// }

// function fetchBanks() {
//     fetch(`${SERVER_URL}/get-banks`)
//         .then(response => response.json())
//         .then(banks => {
//             const bankListDiv = document.getElementById('bankList');
//             bankListDiv.innerHTML = banks.map(bank => `
//                 <div class="card">
//                     <div class="card-body">
//                         <h5 class="card-title">${bank.bankName}</h5>
//                         <p class="card-text">Branch: ${bank.branchName}</p>
//                         <p class="card-text">Location: ${bank.branchLocation}</p>
//                         <button class="btn view-data-btn"
//                                 style="background-color: #007bff; color: white;"
//                                 data-bank-id="${bank._id}"
//                                 data-bank-name="${bank.bankName}">
//                             View Data
//                         </button>
//                     </div>
//                 </div>
//             `).join('');

//             // Attach event listeners AFTER injecting elements
//             document.querySelectorAll('.view-data-btn').forEach(button => {
//                 button.addEventListener('click', function () {
//                     const bankId = this.getAttribute('data-bank-id');
//                     const bankName = this.getAttribute('data-bank-name');
//                     console.log(`Button Clicked: Fetching data for Bank ID: ${bankId}, Bank Name: ${bankName}`); // Debugging
//                     fetchBankData(bankId, bankName);
//                 });
//             });
//         })
//         .catch(error => console.error('Error fetching banks:', error));
// }

function fetchBanks() {
  fetch(`${SERVER_URL}/get-banks`)
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

      // Attach event listeners AFTER injecting elements
      document.querySelectorAll(".view-data-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const bankId = this.getAttribute("data-bank-id");
          const bankName = this.getAttribute("data-bank-name");
          console.log(
            `Fetching data for Bank ID: ${bankId}, Bank Name: ${bankName}`
          );
          fetchBankData(bankId, bankName);
        });
      });

      document.querySelectorAll(".generate-report-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const bankId = this.getAttribute("data-bank-id");
          const bankName = this.getAttribute("data-bank-name");
          console.log(
            `Generating report for Bank ID: ${bankId}, Bank Name: ${bankName}`
          );
          showReportSection(bankId, bankName);
        });
      });
    })
    .catch((error) => console.error("Error fetching banks:", error));
}

function fetchBankData(bankId, bankName) {
  fetch(`${SERVER_URL}/getall-details?bankId=${bankId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
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
        "Bank Data for: " + entries[0].bank.bankName; // Update title
    })
    .catch((error) => console.error("Error fetching bank data:", error));
}

function showReportSection(bankId, bankName) {
  document.getElementById("reportBankName").textContent = bankName;
  document.getElementById("reportGenerationSection").style.display = "block";
  document.getElementById("generateReportBtn").onclick = () =>
    generateReport(bankId, bankName);
}

function generateReport(bankId, bankName) {
  const reportFormat = document.getElementById("reportFormat").value;

  fetch(`${SERVER_URL}/generate-report?bankId=${bankId}&format=${reportFormat}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      return response.blob(); // Assuming the server sends a file blob
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Report_${bankName}.${reportFormat}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((error) => console.error("Error generating report:", error));
}
