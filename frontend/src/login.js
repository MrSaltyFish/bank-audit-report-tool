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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }

          return data;
        })
        .then((data) => {
          console.log("Login Success ✅", data);

          if (data.success && data.token) {
            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("isAuthenticated", "true");
            window.location.href = "dashboard.html";
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
