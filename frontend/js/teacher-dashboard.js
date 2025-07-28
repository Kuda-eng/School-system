// Function to load all grades and populate the table
const loadAllGrades = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/teacher/grades', {
      credentials: 'include'
    });
    const data = await res.json();

    const tbody = document.getElementById('allGradesTable').querySelector('tbody');
    tbody.innerHTML = '';

    data.forEach(grade => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${grade.studentId.fullName}</td>
        <td><input value="${grade.subject}" class="subject"/></td>
        <td><input value="${grade.score}" type="number" class="score"/></td>
        <td><input value="${grade.total}" type="number" class="total"/></td>
        <td><input value="${grade.term}" class="term"/></td>
        <td><input value="${grade.year}" class="year"/></td>
        <td><input value="${grade.comment || ''}" class="comment"/></td>
        <td>
          <button class="saveBtn" data-id="${grade._id}">💾</button>
          <button class="deleteBtn" data-id="${grade._id}">🗑️</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Failed to load grades:', error);
  }
};

// Function to load all students into the dropdown
const loadStudents = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/admin/students', {
      credentials: 'include'
    });
    const data = await res.json();

    const dropdown = document.getElementById('gradeStudent');
    dropdown.innerHTML = '';

    data.forEach(student => {
      const option = document.createElement('option');
      option.value = student._id;
      option.textContent = `${student.fullName} (${student.email})`;
      dropdown.appendChild(option);
    });
  } catch (err) {
    console.error('Error loading students:', err);
  }
};

// Load students and grades on page load
window.onload = async () => {
  await loadStudents();
  await loadAllGrades();
};

// Handle grade submission
document.getElementById('gradeForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const studentId = document.getElementById('gradeStudent').value;
  const subject = document.getElementById('subject').value;
  const score = document.getElementById('score').value;
  const total = document.getElementById('total').value;
  const comment = document.getElementById('comment').value;
  const term = document.getElementById('term').value || 'Term 1';
  const year = document.getElementById('year').value;

  try {
    const response = await fetch('http://localhost:5000/api/teacher/record-grade', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, subject, score, total, comment, term, year })
    });

    const result = await response.json();
    document.getElementById('gradeMsg').textContent = response.ok ? '✅ Grade submitted!' : '❌ ' + result.message;

    if (response.ok) {
      document.getElementById('gradeForm').reset();
      await loadAllGrades();
    }
  } catch (err) {
    console.error('Error submitting grade:', err);
    document.getElementById('gradeMsg').textContent = '❌ Something went wrong';
  }
});

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('http://localhost:5000/api/auth/logout', {
    credentials: 'include'
  });
  window.location.href = './login.html';
});

// Handle save and delete grade actions
document.getElementById('allGradesTable').addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  const row = e.target.closest('tr');

  if (e.target.classList.contains('saveBtn')) {
    const subject = row.querySelector('.subject').value;
    const score = row.querySelector('.score').value;
    const total = row.querySelector('.total').value;
    const term = row.querySelector('.term').value;
    const year = row.querySelector('.year').value;
    const comment = row.querySelector('.comment').value;

    const res = await fetch(`http://localhost:5000/api/teacher/grades/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, score, total, term, year, comment })
    });

    const result = await res.json();
    alert(result.message);
  }

  if (e.target.classList.contains('deleteBtn')) {
    if (confirm('Are you sure you want to delete this grade?')) {
      const res = await fetch(`http://localhost:5000/api/teacher/grades/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const result = await res.json();
      alert(result.message);
      await loadAllGrades();
    }
  }
});
