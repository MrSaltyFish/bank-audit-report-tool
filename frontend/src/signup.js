// document.getElementById('signupForm').addEventListener('submit', async (event) => {
//     event.preventDefault(); // Prevent default form submission

//     const username = document.getElementById('username').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     try {
//         const response = await fetch(`${SERVER_URL}/signup`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username, email, password }),
//         });

//         const data = await response.json(); // Parse JSON response

//         if (response.status === 201) {
//             alert('Signup successful! Redirecting to login...');
//             window.location.href = 'login.html'; // Redirect to login page
//         } else {
//             alert(data.message || 'Signup failed. Please try again.'); // Display error message
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('Something went wrong. Please try again later.');
//     }
// });

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = ''; // Clear any previous messages
    messageContainer.classList.remove('alert', 'alert-success', 'alert-danger'); // Remove previous styles

    try {
        const response = await fetch(`${SERVER_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json(); // Parse JSON response

        if (response.status === 201) {
            messageContainer.classList.add('alert', 'alert-success');
            messageContainer.textContent = 'Signup successful! Redirecting to login...';
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirect after a short delay
            }, 1500); // Adjust delay as needed
        } else {
            messageContainer.classList.add('alert', 'alert-warning');
            messageContainer.textContent = data.message || 'Signup failed. Please try again.'; // Display error message
        }
    } catch (error) {
        console.error('Error:', error);
        messageContainer.classList.add('alert', 'alert-danger');
        messageContainer.textContent = 'Something went wrong. Please try again later.';
    }
});