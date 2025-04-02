const SERVER_URL = import.meta.env.VITE_SERVER_URL;

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email, password }).toString(),
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
          if (data.success) {
            window.location.href = "dashboard.html"; // Redirect on success
          }
        })
        .catch((error) => {
          document.getElementById("error-message").textContent = error.message;
          document.getElementById("error-message").style.display = "block";
        });
    });
});
