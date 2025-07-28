// frontend/js/timetable.js

window.onload = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/timetable/my-timetable', {
      credentials: 'include'
    });
    const data = await res.json();

    const tbody = document.getElementById('timetableTable').querySelector('tbody');
    tbody.innerHTML = '';

    if (!res.ok) {
      tbody.innerHTML = `<tr><td colspan="5">${data.message || 'No timetable found'}</td></tr>`;
      return;
    }

    data.forEach(entry => {
      const row = `<tr>
        <td>${entry.day}</td>
        <td>${entry.subject}</td>
        <td>${entry.startTime}</td>
        <td>${entry.endTime}</td>
        <td>${entry.location}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error('Error loading timetable:', err);
    const tbody = document.getElementById('timetableTable').querySelector('tbody');
    tbody.innerHTML = `<tr><td colspan="5">Error loading timetable</td></tr>`;
  }
};

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('http://localhost:5000/api/auth/logout', {
    credentials: 'include'
  });
  window.location.href = './login.html';
});
