// frontend/js/login.js

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            credentials: 'include',  // Important to send the session cookie
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Redirect to dashboard.html (we'll create it later)
            window.location.href = './dashboard.html';
        } else {
            document.getElementById('message').textContent = result.message;
        }

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'Something went wrong. Try again.';
    }
});
