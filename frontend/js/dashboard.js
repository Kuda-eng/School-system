// frontend/js/dashboard.js

window.onload = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/protected', {
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('user-info').textContent =
        `Logged in as ${data.role.toUpperCase()}`;
    } else {
      window.location.href = './login.html'; // Redirect if not logged in
    }
  } catch (err) {
    console.error('Error fetching user info', err);
    window.location.href = './login.html';
  }
};

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('http://localhost:5000/api/auth/logout', {
    credentials: 'include'
  });
  window.location.href = './login.html';
});
