const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Autofill the Bank ID from the URL
document.addEventListener('DOMContentLoaded', () => {
    const bankID = getUrlParameter('bankId'); // Adjust this parameter name if needed
    console.log("Bank ID is " + bankID);
    if (bankID) {
        document.getElementById('bankID').value = bankID;
    }
});

document.getElementById('addDataForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const bankID = document.getElementById('bankID').value;
    const accountNo = document.getElementById('accountNo').value;
    const nameOfBorrower = document.getElementById('nameOfBorrower').value;
    const dateOfSanctionRenewal = document.getElementById('dateOfSanctionRenewal').value;
    const sanctionedAmount = document.getElementById('sanctionedAmount').value;
    const outstandingBalance = document.getElementById('outstandingBalance').value;
    const otherFacilities = document.getElementById('otherFacilities').value;

    const response = await fetch(`${SERVER_URL}/create-entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bankID, accountNo, nameOfBorrower, dateOfSanctionRenewal, sanctionedAmount, outstandingBalance, otherFacilities
        })
    });

    const result = await response.text();
    alert(result);
});

document.getElementById('addQueryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const accountNoObservation = document.getElementById('accountNoObservation').value;
    const query = document.getElementById('query').value;
    const details = document.getElementById('details').value;

    const response = await fetch(`${SERVER_URL}/add-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNo: accountNoObservation, query, details })
    });

    const result = await response.text();
    alert(result);
});

document.getElementById('getDetailsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const accountNoToFetch = document.getElementById('accountNoToFetch').value;

    const response = await fetch(`${SERVER_URL}/get-details?accountNo=${accountNoToFetch}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    const detailsOutput = document.getElementById('detailsOutput');
    detailsOutput.innerHTML = ''; // Clear previous output

    if (result.length > 0) {
        result.forEach(entry => {
            detailsOutput.innerHTML += `
                <div class="card mt-2">
                    <div class="card-body">
                        <h5 class="card-title">Account No: ${entry.accountNo}</h5>
                        <p class="card-text"><strong>Query:</strong> ${entry.query}</p>
                        <p class="card-text"><strong>Details:</strong> ${entry.details}</p>
                    </div>
                </div>
            `;
        });
    } else {
        detailsOutput.innerHTML = '<p>No queries found for this account number.</p>';
    }
});
