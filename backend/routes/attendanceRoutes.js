// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Timetable = require('../models/Timetable');
const Student = require('../models/Student');

// Record attendance for a class period
router.post('/mark', async (req, res) => {
  try {
    const { teacherId, date, day, subject, periodStart, periodEnd, studentStatuses } = req.body;

    // Create attendance entry
    const attendance = await Attendance.create({
      teacherId,
      date,
      day,
      subject,
      periodStart,
      periodEnd,
      studentStatuses // array of { studentId, status: 'present' | 'absent' | 'late' }
    });

    res.json({ message: '✅ Attendance recorded successfully.', attendance });
  } catch (err) {
    console.error('Attendance mark error:', err);
    res.status(500).json({ message: '❌ Failed to record attendance.' });
  }
});

// Get attendance history for a specific teacher
router.get('/history/:teacherId', async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ teacherId: req.params.teacherId })
      .sort({ date: -1 });
    res.json(attendanceRecords);
  } catch (err) {
    console.error('Fetch attendance error:', err);
    res.status(500).json({ message: 'Failed to fetch attendance.' });
  }
});

// Get attendance report for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const records = await Attendance.find({
      'studentStatuses.studentId': req.params.studentId
    });

    const summary = records.flatMap(r =>
      r.studentStatuses.filter(s => s.studentId == req.params.studentId).map(s => ({
        date: r.date,
        subject: r.subject,
        status: s.status
      }))
    );

    res.json(summary);
  } catch (err) {
    console.error('Student attendance fetch error:', err);
    res.status(500).json({ message: 'Failed to get student attendance' });
  }
});

module.exports = router;
