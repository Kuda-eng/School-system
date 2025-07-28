const API_BASE = 'http://localhost:5000/api/fees';

// Update total amount due
document.getElementById('updateFeeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentId = document.getElementById('studentId').value.trim();
  const totalAmountDue = document.getElementById('totalAmountDue').value;

  try {
    const res = await fetch(`${API_BASE}/update/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalAmountDue }),
    });

    const data = await res.json();
    alert(data.message);
    fetchAllFees();
  } catch (error) {
    console.error('Error updating fee:', error);
    alert('❌ Could not update fee.');
  }
});

// Fetch all fee records
async function fetchAllFees() {
  try {
    const res = await fetch(`${API_BASE}/all`);
    const fees = await res.json();

    const container = document.getElementById('feeRecords');
    container.innerHTML = '';

    fees.forEach((fee) => {
      const div = document.createElement('div');
      div.innerHTML = `
        <p><strong>${fee.studentId.name} (${fee.studentId.email})</strong></p>
        <p>💰 Total Due: ${fee.totalAmountDue || 'N/A'} | Paid: ${fee.totalAmountPaid || 0}</p>
        <p>📜 History:</p>
        <ul>
          ${(fee.paymentHistory || []).map(p => `<li>${p.amount} via ${p.method}</li>`).join('')}
        </ul>
        <hr />
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Fetch fees error:', error);
    alert('❌ Failed to load fee records.');
  }
}
