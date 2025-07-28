window.onload = async () => {
  try {
    // Load monthly fee
    const feeRes = await fetch('http://localhost:5000/api/student/my-fee', {
      credentials: 'include'
    });
    const feeData = await feeRes.json();

    if (feeRes.ok) {
      document.getElementById('feeInfo').textContent =
        `Your fee is ${feeData.amount} ${feeData.currency} (Last updated: ${new Date(feeData.updatedAt).toLocaleDateString()})`;
    } else {
      document.getElementById('feeInfo').textContent = feeData.message || 'No fee info available.';
    }

    // Load payment history
    const payRes = await fetch('http://localhost:5000/api/student/my-payments', {
      credentials: 'include'
    });
    const payData = await payRes.json();

    if (payRes.ok) {
      document.getElementById('totalPaid').textContent = `${payData.totalPaid} USD`;
      document.getElementById('balance').textContent = `${payData.balance} USD`;

      const tbody = document.getElementById('paymentTable').querySelector('tbody');
      tbody.innerHTML = '';

      payData.payments.forEach(payment => {
        const row = `<tr>
          <td>${payment.amountPaid}</td>
          <td>${payment.method}</td>
          <td>${new Date(payment.paidAt).toLocaleDateString()}</td>
          <td>${payment.notes || '-'}</td>
        </tr>`;
        tbody.innerHTML += row;
      });
    }

    // Load grades
    const gradesRes = await fetch('http://localhost:5000/api/student/my-grades', {
      credentials: 'include'
    });
    const grades = await gradesRes.json();

    if (gradesRes.ok) {
      const tbody = document.getElementById('gradesTable').querySelector('tbody');
      tbody.innerHTML = '';

      grades.forEach(grade => {
        const percent = ((grade.score / grade.total) * 100).toFixed(1);
        const row = `<tr>
          <td>${grade.subject}</td>
          <td>${grade.score}</td>
          <td>${grade.total}</td>
          <td>${percent}%</td>
          <td>${grade.comment || '-'}</td>
          <td>${grade.term}</td>
          <td>${grade.year}</td>
        </tr>`;
        tbody.innerHTML += row;
      });
    }

  } catch (err) {
    console.error('Error loading data:', err);
    document.getElementById('feeInfo').textContent = 'Error loading fee info.';
    document.getElementById('totalPaid').textContent = 'Error';
    document.getElementById('balance').textContent = 'Error';
  }
};

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('http://localhost:5000/api/auth/logout', {
    credentials: 'include'
  });
  window.location.href = './login.html';
});
