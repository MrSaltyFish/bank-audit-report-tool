
// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     fetch('/login', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: new URLSearchParams({ email, password }).toString(),
// })
//     .then(response => {
//         if (!response.ok) {
//             return response.json().then(data => {
//                 throw new Error(data.message || 'Login failed');
//             });
//         }
//         return response.json();
//     })
//     .then(data => {
//         if (data.success) {
//             window.location.href = '/dashboard'; // Redirect on successful login
//         }
//     })
//     .catch(error => {
//         document.getElementById('error-message').textContent = error.message;
//         document.getElementById('error-message').style.display = 'block';
//     });
// });


const SERVER_URL = "http://localhost:3000"


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch(`${SERVER_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ email, password }).toString(),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Login failed');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                window.location.href = 'dashboard.html'; // Redirect on success
            }
        })
        .catch(error => {
            document.getElementById('error-message').textContent = error.message;
            document.getElementById('error-message').style.display = 'block';
        });
    });
});


// document.addEventListener("DOMContentLoaded", () => {
//     document.getElementById('loginForm').addEventListener('submit', function(event) {
//         event.preventDefault();

//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;

//         // Fake authentication (Replace with real API)
//         if (email === "admin@example.com" && password === "password") {
//             localStorage.setItem("loggedIn", "true"); // Store login state
//             window.location.href = "home.html"; // Redirect to home page
//         } else {
//             document.getElementById('error-message').textContent = "Invalid email or password.";
//             document.getElementById('error-message').style.display = "block";
//         }
//     });
// });
