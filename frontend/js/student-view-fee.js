const API_BASE = 'http://localhost:5000/api/fees';

document.getElementById('viewFeeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentId = document.getElementById('studentId').value.trim();

  try {
    const res = await fetch(`${API_BASE}/${studentId}`);
    if (!res.ok) throw new Error('Fee record not found');

    const fee = await res.json();

    const container = document.getElementById('feeDetails');
    container.innerHTML = `
      <h3>📋 Fee Record for ${fee.studentId.name || 'N/A'}</h3>
      <p>💰 Total Due: ${fee.totalAmountDue || 0}</p>
      <p>✅ Paid: ${fee.totalAmountPaid || 0}</p>
      <p>📜 Payment History:</p>
      <ul>
        ${(fee.paymentHistory || []).map(p => `<li>${p.amount} via ${p.method}</li>`).join('')}
      </ul>
    `;
  } catch (err) {
    document.getElementById('feeDetails').innerHTML = `<p style="color: red;">❌ ${err.message}</p>`;
  }
});
