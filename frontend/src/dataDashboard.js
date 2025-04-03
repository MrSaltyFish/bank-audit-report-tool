const SERVER_URL = import.meta.env.VITE_SERVER_URL;

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
