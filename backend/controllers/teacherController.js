const Grade = require('../models/Grade');
const User = require('../models/User');

exports.recordGrade = async (req, res) => {
  try {
    const { studentId, subject, score, total, comment, term, year } = req.body;

    // Check student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const newGrade = new Grade({
      studentId,
      subject,
      score,
      total,
      comment,
      term,
      year
    });

    await newGrade.save();
    res.status(201).json({ message: 'Grade recorded successfully' });
  } catch (err) {
    console.error('Error recording grade:', err.message);
    res.status(500).json({ message: 'Failed to record grade' });
  }
};

// View all grades
exports.getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('studentId', 'fullName email') // For student details
      .sort({ dateRecorded: -1 });

    res.status(200).json(grades);
  } catch (err) {
    console.error('Error fetching grades:', err.message);
    res.status(500).json({ message: 'Failed to load grades' });
  }
};

// Edit a grade
exports.updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, score, total, comment, term, year } = req.body;

    const updated = await Grade.findByIdAndUpdate(id, {
      subject,
      score,
      total,
      comment,
      term,
      year
    }, { new: true });

    if (!updated) return res.status(404).json({ message: 'Grade not found' });

    res.status(200).json({ message: 'Grade updated successfully', updated });
  } catch (err) {
    console.error('Error updating grade:', err.message);
    res.status(500).json({ message: 'Failed to update grade' });
  }
};

// Delete a grade
exports.deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Grade.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Grade not found' });

    res.status(200).json({ message: 'Grade deleted successfully' });
  } catch (err) {
    console.error('Error deleting grade:', err.message);
    res.status(500).json({ message: 'Failed to delete grade' });
  }
};
