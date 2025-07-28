window.onload = async () => {
  const table = document.getElementById('resultsTable');
  const tbody = table.querySelector('tbody');

  try {
    const res = await fetch('http://localhost:5000/api/results/my', {
      credentials: 'include'
    });
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      document.getElementById('msg').textContent = 'No results found.';
      return;
    }

    table.style.display = '';

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
    console.error('Error loading results:', err);
    document.getElementById('msg').textContent = '❌ Failed to load your results.';
  }
};
