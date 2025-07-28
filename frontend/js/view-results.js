window.onload = async () => {
  const studentSelect = document.getElementById('studentSelect');
  const table = document.getElementById('resultsTable');
  const tbody = table.querySelector('tbody');

  try {
    const res = await fetch('http://localhost:5000/api/admin/students', {
      credentials: 'include'
    });
    const students = await res.json();

    studentSelect.innerHTML = '<option value="">--Select Student--</option>';
    students.forEach(student => {
      const opt = document.createElement('option');
      opt.value = student._id;
      opt.textContent = `${student.fullName} (${student.email})`;
      studentSelect.appendChild(opt);
    });
  } catch (err) {
    document.getElementById('msg').textContent = '❌ Failed to load students.';
  }

  studentSelect.addEventListener('change', async () => {
    const studentId = studentSelect.value;
    if (!studentId) return;

    tbody.innerHTML = '';
    try {
      const res = await fetch(`http://localhost:5000/api/results/student/${studentId}`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (data.length === 0) {
        table.style.display = 'none';
        document.getElementById('msg').textContent = 'No results found.';
        return;
      }

      table.style.display = '';
      document.getElementById('msg').textContent = '';

      data.forEach(result => {
        const row = `<tr>
          <td>${result.subject}</td>
          <td>${result.score}</td>
          <td>${result.total}</td>
          <td>${result.percentage.toFixed(2)}%</td>
          <td>${result.grade}</td>
          <td>${result.term}</td>
          <td>${result.year}</td>
        </tr>`;
        tbody.innerHTML += row;
      });
    } catch (err) {
      console.error('Failed to load results:', err);
      document.getElementById('msg').textContent = '❌ Error loading results.';
    }
  });
};
