const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const jwtToken = localStorage.getItem("jwtToken");

import "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  await checkAuth();
  fetchBanks();

  document
    .getElementById("bankForm")
    .addEventListener("submit", handleBankFormSubmit);
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(`${SERVER_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // important if you're using cookies/session
    });

    if (!res.ok) throw new Error("Logout failed");

    localStorage.removeItem("jwtToken");
    window.location.href = "login.html";
  } catch (err) {
    console.error("Logout error:", err);
    alert("Error logging out. Try again.");
  }
});

async function handleBankFormSubmit(e) {
  e.preventDefault();
  const bankName = document.getElementById("bankName").value.trim();
  const branchName = document.getElementById("branchName").value.trim();
  const branchLocation = document.getElementById("branchLocation").value.trim();

  if (!bankName || !branchName || !branchLocation) {
    alert("All fields are required!");
    return;
  }

  try {
    const response = await fetch(`${SERVER_URL}/bank/add-bank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bankName, branchName, branchLocation }),
    });

    const data = await response.json();
    document.getElementById("bankMessage").textContent = data.message;
    document.getElementById("bankForm").reset();
    fetchBanks();
  } catch (error) {
    console.error("Error adding bank:", error);
  }
}

async function fetchBanks() {
  console.log("Fetching banks...");
  try {
    const response = await fetch(`${SERVER_URL}/bank/get-banks`);
    const data = await response.json();

    const bankListDiv = document.getElementById("bankList");
    bankListDiv.innerHTML = "";

    data.forEach((bank) => {
      const bankCard = document.createElement("div");
      bankCard.classList.add("card");
      bankCard.innerHTML = `
        <div class="card-body">
          <a href="/public/dataDashboard?bankId=${bank._id}" class="text-decoration-none text-dark">
            <h5 class="card-title">${bank.bankName}</h5>
            <p class="card-text">Branch: ${bank.branchName}</p>
            <p class="card-text">Location: ${bank.branchLocation}</p>
          </a>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${bank._id}">Delete Bank</button>
        </div>
      `;

      bankCard.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        deleteBank(bank._id);
      });

      bankListDiv.appendChild(bankCard);
    });
  } catch (error) {
    console.error("Error fetching banks:", error);
  }
}

async function deleteBank(bankId) {
  if (!confirm("Are you sure you want to delete this bank?")) return;

  try {
    const response = await fetch(`${SERVER_URL}/bank/delete-bank/${bankId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete bank");
    }

    const data = await response.json();
    alert(data.message);
    fetchBanks();
  } catch (error) {
    console.error("Error deleting bank:", error);
  }
}
