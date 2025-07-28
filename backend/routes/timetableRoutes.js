const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const PDFDocument = require('pdfkit');

// Helper to check for time conflicts
function hasTimeConflict(entries) {
  const schedule = {};

  for (let entry of entries) {
    const { day, startTime, endTime } = entry;
    if (!schedule[day]) schedule[day] = [];

    const start = parseInt(startTime.replace(':', ''), 10);
    const end = parseInt(endTime.replace(':', ''), 10);

    for (let existing of schedule[day]) {
      if (start < existing.end && end > existing.start) return true;
    }
    schedule[day].push({ start, end });
  }

  return false;
}

// Admin assigns or updates a full timetable
router.post('/assign', async (req, res) => {
  try {
    const { role, userId, entries } = req.body;

    if (hasTimeConflict(entries)) {
      return res.status(400).json({ message: '⛔ Time conflict in timetable entries.' });
    }

    const existing = await Timetable.findOne({ userId, role });

    if (existing) {
      existing.entries = entries;
      await existing.save();
      return res.json({ message: '✅ Timetable updated successfully' });
    }

    await Timetable.create({ role, userId, entries });
    res.json({ message: '✅ Timetable created successfully' });
  } catch (err) {
    console.error('Assign timetable error:', err);
    res.status(500).json({ message: '❌ Failed to assign timetable' });
  }
});

// View your own timetable (for logged-in student or teacher)
router.get('/my-timetable', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const role = req.session.user.role;

    const timetable = await Timetable.findOne({ userId, role });

    if (!timetable) return res.status(404).json({ message: 'No timetable found' });

    res.json(timetable);
  } catch (err) {
    console.error('Fetch timetable error:', err);
    res.status(500).json({ message: 'Error loading timetable' });
  }
});

// Admin fetches timetable for a specific user (to display current entries)
router.get('/user/:role/:id', async (req, res) => {
  try {
    const { role, id } = req.params;
    const timetable = await Timetable.findOne({ role, userId: id });

    if (!timetable) return res.status(404).json({ message: 'No timetable found' });

    res.json(timetable);
  } catch (err) {
    console.error('Get timetable for user error:', err);
    res.status(500).json({ message: 'Failed to load timetable' });
  }
});

// Admin updates one entry at a specific index
router.put('/update-entry/:role/:id/:index', async (req, res) => {
  try {
    const { role, id, index } = req.params;
    const updatedEntry = req.body;

    const timetable = await Timetable.findOne({ role, userId: id });
    if (!timetable || !timetable.entries[index]) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Check conflict excluding current index
    const tempEntries = [...timetable.entries];
    tempEntries[index] = updatedEntry;

    if (hasTimeConflict(tempEntries)) {
      return res.status(400).json({ message: '⛔ Time conflict detected after update.' });
    }

    timetable.entries[index] = updatedEntry;
    await timetable.save();

    res.json({ message: '✅ Entry updated successfully' });
  } catch (err) {
    console.error('Update entry error:', err);
    res.status(500).json({ message: 'Failed to update entry' });
  }
});

// Admin deletes one entry at a specific index
router.delete('/delete-entry/:role/:id/:index', async (req, res) => {
  try {
    const { role, id, index } = req.params;

    const timetable = await Timetable.findOne({ role, userId: id });
    if (!timetable || timetable.entries.length <= index) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    timetable.entries.splice(index, 1);
    await timetable.save();

    res.json({ message: '✅ Entry deleted successfully' });
  } catch (err) {
    console.error('Delete entry error:', err);
    res.status(500).json({ message: 'Failed to delete entry' });
  }
});

// Export timetable as PDF
router.get('/export/:role/:id', async (req, res) => {
  try {
    const { role, id } = req.params;
    const timetable = await Timetable.findOne({ role, userId: id });

    if (!timetable) return res.status(404).json({ message: 'No timetable found' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="timetable.pdf"');

    doc.pipe(res);
    doc.fontSize(16).text(`📅 Timetable for ${role.toUpperCase()} (${id})\n`, { underline: true });

    timetable.entries.forEach(entry => {
      doc.fontSize(12).text(
        `${entry.day} - ${entry.subject} - ${entry.startTime} to ${entry.endTime} @ ${entry.location}`
      );
    });

    doc.end();
  } catch (err) {
    console.error('Export PDF error:', err);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

module.exports = router;
