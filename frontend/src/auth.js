const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

async function checkAuth() {
  const jwtToken = localStorage.getItem("jwtToken"); // 🔹 This must exist

  if (!jwtToken) {
    console.warn("Token missing — redirecting...");
    window.location.href = "notAuthenticated.html";
    return;
  }

  try {
    const response = await fetch(`${SERVER_URL}/auth/check-auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    const data = await response.json();
    console.log("✅ Authenticated:", data);
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    window.location.href = "notAuthenticated.html";
  }
}

document.addEventListener("DOMContentLoaded", checkAuth);
