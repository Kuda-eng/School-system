const Result = require('../models/Result');
const Student = require('../models/Student');

// Helper to calculate grade
const getGrade = (score) => {
  if (score <= 40) return 'U';
  if (score <= 47) return 'E';
  if (score <= 54) return 'D';
  if (score <= 64) return 'C';
  if (score <= 79) return 'B';
  return 'A';
};

// Record a new result
exports.recordResult = async (req, res) => {
  try {
    const { studentId, subject, score, total, term, year, comment } = req.body;

    const grade = getGrade(score);

    // Optional: Attach teacherId from req.user.id (if you want to track who recorded it)
    const teacherId = req.user ? req.user.id : null;

    const result = await Result.create({
      studentId,
      subject,
      score,
      total,
      grade,
      term,
      year,
      comment,
      teacherId,
    });

    res.json({ message: '✅ Result recorded successfully.', result });
  } catch (err) {
    console.error('Error recording result:', err);
    res.status(500).json({ message: '❌ Failed to record result.' });
  }
};

// Get results for a specific student
exports.getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId }).sort({ year: -1, term: 1 });
    res.json(results);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: '❌ Failed to fetch results.' });
  }
};

// Get all students (to populate dropdown)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}, '_id name'); // Fetch only id and name for dropdown
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: '❌ Failed to fetch students.' });
  }
};

// Get all results entered by the logged-in teacher
exports.getTeacherResults = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const results = await Result.find({ teacherId }).sort({ year: -1, term: 1 });
    res.json(results);
  } catch (err) {
    console.error('Error fetching teacher results:', err);
    res.status(500).json({ message: '❌ Failed to fetch results.' });
  }
};
