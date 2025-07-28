// backend/controllers/gradingController.js

function getGradeFromScore(score) {
  const s = parseInt(score);
  if (s >= 80 && s <= 100) return 'A';
  if (s >= 65 && s <= 79) return 'B';
  if (s >= 55 && s <= 64) return 'C';
  if (s >= 48 && s <= 54) return 'D';
  if (s >= 41 && s <= 47) return 'E';
  return 'U';
}

module.exports = { getGradeFromScore };
