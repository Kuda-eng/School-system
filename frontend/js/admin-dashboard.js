// frontend/js/admin-dashboard.js

// Add user logic
document.getElementById('addUserForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  try {
    const response = await fetch('http://localhost:5000/api/admin/add-user', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName, email, password, role })
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('message').textContent = '✅ User added successfully!';
      document.getElementById('addUserForm').reset();
    } else {
      document.getElementById('message').textContent = `❌ ${result.message}`;
    }
  } catch (err) {
    console.error('Error:', err);
    document.getElementById('message').textContent = '❌ Something went wrong.';
  }
});

// Logout logic
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('http://localhost:5000/api/auth/logout', {
    credentials: 'include'
  });
  window.location.href = './login.html';
});

// Load and display all users
async function loadUsers() {
  try {
    const response = await fetch('http://localhost:5000/api/admin/all-users', {
      credentials: 'include'
    });

    const users = await response.json();
    const table = document.getElementById('usersTable').querySelector('tbody');
    table.innerHTML = ''; // clear previous content

    users.forEach(user => {
      const row = `<tr>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
      </tr>`;
      table.innerHTML += row;
    });
  } catch (error) {
    console.error('Failed to load users:', error);
  }
// also populate student select dropdown
const studentSelect = document.getElementById('studentSelect');
studentSelect.innerHTML = '<option value="">-- Select Student --</option>';

users
  .filter(user => user.role === 'student')
  .forEach(student => {
    const option = document.createElement('option');
    option.value = student._id;
    option.textContent = student.fullName;
    studentSelect.appendChild(option);
  });
// inside loadUsers()
const paymentDropdown = document.getElementById('paymentStudent');
paymentDropdown.innerHTML = '<option value="">-- Select Student --</option>';

users
  .filter(user => user.role === 'student')
  .forEach(student => {
    const option = document.createElement('option');
    option.value = student._id;
    option.textContent = student.fullName;
    paymentDropdown.appendChild(option);
  });

}
// Submit fee form
document.getElementById('feeForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const studentId = document.getElementById('studentSelect').value;
  const amount = document.getElementById('feeAmount').value;

  try {
    const response = await fetch('http://localhost:5000/api/admin/set-fee', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, amount })
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('feeMsg').textContent = '✅ Fee updated successfully';
      document.getElementById('feeForm').reset();
    } else {
      document.getElementById('feeMsg').textContent = '❌ ' + result.message;
    }
  } catch (err) {
    console.error('Error setting fee:', err);
    document.getElementById('feeMsg').textContent = '❌ Something went wrong';
  }
});

// Load users on page load
window.onload = async () => {
  await loadUsers();
  await loadAllFees();
};

async function loadAllFees() {
  try {
    const response = await fetch('http://localhost:5000/api/admin/all-fees', {
      credentials: 'include'
    });

    const fees = await response.json();
    const table = document.getElementById('feesTable').querySelector('tbody');
    table.innerHTML = '';

    fees.forEach(fee => {
      const row = `<tr>
        <td>${fee.studentId?.fullName}</td>
        <td>${fee.studentId?.email}</td>
        <td>${fee.amount} ${fee.currency}</td>
        <td>${new Date(fee.updatedAt).toLocaleString()}</td>
      </tr>`;
      table.innerHTML += row;
    });
  } catch (err) {
    console.error('Error loading fees:', err);
  }
}

document.getElementById('paymentForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const studentId = document.getElementById('paymentStudent').value;
  const amountPaid = document.getElementById('amountPaid').value;
  const method = document.getElementById('method').value;
  const notes = document.getElementById('notes').value;

  try {
    const response = await fetch('http://localhost:5000/api/admin/record-payment', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, amountPaid, method, notes })
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('paymentMsg').textContent = '✅ Payment recorded';
      document.getElementById('paymentForm').reset();
    } else {
      document.getElementById('paymentMsg').textContent = '❌ ' + result.message;
    }
  } catch (err) {
    console.error('Error:', err);
    document.getElementById('paymentMsg').textContent = '❌ Something went wrong';
  }
});
