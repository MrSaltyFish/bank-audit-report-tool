const SERVER_URL = import.meta.env.VITE_SERVER_URL;

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        credentials: "include", // 🔹 Sends cookies (if applicable)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message || "Login failed");
            });
          }
          return response.json();
        })
        .then((data) => {
          if (data.success && data.token) {
            localStorage.setItem("jwtToken", data.token); // 🔹 Store JWT token
            localStorage.setItem("isAuthenticated", "true"); // Save auth state
            window.location.href = "dashboard.html"; // Redirect on success
          } else {
            throw new Error("Invalid response from server");
          }
        })
        .catch((error) => {
          document.getElementById("error-message").textContent = error.message;
          document.getElementById("error-message").style.display = "block";
        });
    });
});
