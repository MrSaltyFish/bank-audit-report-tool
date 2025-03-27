document.getElementById('bankForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const bankName = document.getElementById('bankName').value;
    const branchName = document.getElementById('branchName').value;
    const branchLocation = document.getElementById('branchLocation').value;

    fetch('/add-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankName, branchName, branchLocation })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('bankMessage').textContent = data.message;
        document.getElementById('bankForm').reset();
        fetchBanks();
    })
    .catch(error => {
        console.error('Error adding bank:', error);
    });
});

function fetchBanks() {
    fetch('/get-banks')
        .then(response => response.json())
        .then(data => {
            const bankListDiv = document.getElementById('bankList');
            bankListDiv.innerHTML = '';
            data.forEach(bank => {
                bankListDiv.innerHTML += `
                    <div class="card">
                        <div class="card-body">
                            <a href="/dataDashboard?bankId=${bank._id}" class="text-decoration-none text-dark">
                                <h5 class="card-title">${bank.bankName}</h5>
                                <p class="card-text">Branch: ${bank.branchName}</p>
                                <p class="card-text">Location: ${bank.branchLocation}</p>
                            </a>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${bank._id}">Delete Bank</button>
                        </div>
                    </div>
                `;
            });

            const deleteButtons = document.querySelectorAll('.delete-btn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const bankId = button.getAttribute('data-id');
                    deleteBank(bankId);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching banks:', error);
        });
}

function deleteBank(bankId) {
    fetch(`/delete-bank/${bankId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        fetchBanks();
    })
    .catch((error) => {
        console.error('Error deleting bank:', error);
    });
}

window.onload = function() {
    fetchBanks();
};
