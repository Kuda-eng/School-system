window.onload = async () => {
  const studentSelect = document.getElementById('studentSelect');
  studentSelect.innerHTML = '<option>Loading...</option>';

  try {
    const res = await fetch('http://localhost:5000/api/admin/students', {
      credentials: 'include'
    });
    const students = await res.json();

    studentSelect.innerHTML = '<option value="">--Select Student--</option>';
    students.forEach(student => {
      const option = document.createElement('option');
      option.value = student._id;
      option.textContent = `${student.fullName} (${student.email})`;
      studentSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Failed to load students:', err);
    studentSelect.innerHTML = '<option>Error loading students</option>';
  }
};

document.getElementById('resultForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const studentId = document.getElementById('studentSelect').value;
  const subject = document.getElementById('subject').value.trim();
  const score = parseFloat(document.getElementById('score').value);
  const total = parseFloat(document.getElementById('total').value);
  const term = document.getElementById('term').value.trim();
  const year = parseInt(document.getElementById('year').value);

  if (!studentId || !subject || isNaN(score) || isNaN(total) || !term || isNaN(year)) {
    document.getElementById('msg').textContent = '❌ All fields are required.';
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/results/record', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId, subject, score, total, term, year
      })
    });

    const result = await res.json();
    document.getElementById('msg').textContent = result.message || '✅ Result recorded successfully.';
    if (res.ok) this.reset();
  } catch (err) {
    console.error('Submit error:', err);
    document.getElementById('msg').textContent = '❌ Failed to record result.';
  }
});
