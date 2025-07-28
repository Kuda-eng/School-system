// Load users based on role
document.getElementById('role').addEventListener('change', async function () {
  const role = this.value;
  const userSelect = document.getElementById('userSelect');
  userSelect.innerHTML = '<option>Loading...</option>';

  const endpoint = role === 'student' ? 'students' : 'teachers';

  try {
    const res = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
      credentials: 'include'
    });
    const data = await res.json();

    userSelect.innerHTML = '<option value="">--Select--</option>';
    data.forEach(user => {
      const opt = document.createElement('option');
      opt.value = user._id;
      opt.textContent = `${user.fullName} (${user.email})`;
      userSelect.appendChild(opt);
    });
  } catch (err) {
    console.error('Failed to load users:', err);
    userSelect.innerHTML = '<option>Error loading users</option>';
  }
});

// Add timetable entry field
document.getElementById('addEntryBtn').addEventListener('click', () => {
  const container = document.getElementById('entriesContainer');
  const div = document.createElement('div');
  div.innerHTML = `
    <label>Day:</label>
    <input type="text" class="day" placeholder="Monday" required>
    <label>Subject:</label>
    <input type="text" class="subject" required>
    <label>Start:</label>
    <input type="time" class="start" required>
    <label>End:</label>
    <input type="time" class="end" required>
    <label>Location:</label>
    <input type="text" class="location" required>
    <button type="button" onclick="this.parentNode.remove()">❌</button>
    <br><br>
  `;
  container.appendChild(div);
});

// Submit form
document.getElementById('timetableForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const role = document.getElementById('role').value;
  const userId = document.getElementById('userSelect').value;

  if (!role || !userId) {
    document.getElementById('msg').textContent = '❌ Please select both role and user.';
    return;
  }

  const entries = Array.from(document.querySelectorAll('#entriesContainer > div')).map(div => ({
    day: div.querySelector('.day').value,
    subject: div.querySelector('.subject').value,
    startTime: div.querySelector('.start').value,
    endTime: div.querySelector('.end').value,
    location: div.querySelector('.location').value
  }));

  if (entries.length === 0) {
    document.getElementById('msg').textContent = '❌ Add at least one timetable entry.';
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/admin/assign-timetable', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, userId, entries })
    });

    const result = await res.json();
    document.getElementById('msg').textContent = result.message || '✅ Timetable saved!';

    if (res.ok) {
      this.reset();
      document.getElementById('entriesContainer').innerHTML = '';
      document.getElementById('userSelect').dispatchEvent(new Event('change')); // Reload timetable
    }
  } catch (err) {
    console.error('Error submitting timetable:', err);
    document.getElementById('msg').textContent = '❌ Failed to submit timetable.';
  }
});

// Load existing timetable entries
document.getElementById('userSelect').addEventListener('change', async () => {
  const role = document.getElementById('role').value;
  const userId = document.getElementById('userSelect').value;
  const tbody = document.querySelector('#currentTimetable tbody');
  tbody.innerHTML = '';

  if (!role || !userId) return;

  try {
    const res = await fetch(`http://localhost:5000/api/timetable/user/${role}/${userId}`, {
      credentials: 'include'
    });
    const data = await res.json();

    if (!Array.isArray(data.entries)) {
      tbody.innerHTML = '<tr><td colspan="6">No timetable found.</td></tr>';
      return;
    }

    data.entries.forEach((entry, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input value="${entry.day}" class="edit-day"/></td>
        <td><input value="${entry.subject}" class="edit-subject"/></td>
        <td><input type="time" value="${entry.startTime}" class="edit-start"/></td>
        <td><input type="time" value="${entry.endTime}" class="edit-end"/></td>
        <td><input value="${entry.location}" class="edit-location"/></td>
        <td>
          <button onclick="saveTimetableEntry(${index})">💾</button>
          <button onclick="deleteTimetableEntry(${index})">🗑️</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Failed to load timetable:', err);
    tbody.innerHTML = '<tr><td colspan="6">Error loading timetable.</td></tr>';
  }
});

// Save individual timetable entry
async function saveTimetableEntry(index) {
  const role = document.getElementById('role').value;
  const userId = document.getElementById('userSelect').value;

  const row = document.querySelectorAll('#currentTimetable tbody tr')[index];
  const updatedEntry = {
    day: row.querySelector('.edit-day').value,
    subject: row.querySelector('.edit-subject').value,
    startTime: row.querySelector('.edit-start').value,
    endTime: row.querySelector('.edit-end').value,
    location: row.querySelector('.edit-location').value
  };

  const res = await fetch(`http://localhost:5000/api/timetable/update-entry/${role}/${userId}/${index}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedEntry)
  });

  const result = await res.json();
  alert(result.message || 'Saved!');
}

// Delete individual timetable entry
async function deleteTimetableEntry(index) {
  const role = document.getElementById('role').value;
  const userId = document.getElementById('userSelect').value;

  if (!confirm('Delete this entry?')) return;

  const res = await fetch(`http://localhost:5000/api/timetable/delete-entry/${role}/${userId}/${index}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  const result = await res.json();
  alert(result.message || 'Deleted!');
  document.getElementById('userSelect').dispatchEvent(new Event('change')); // Reload
}
