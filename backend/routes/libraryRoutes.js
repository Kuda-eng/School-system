const express = require('express');
const router = express.Router();

const {
  uploadLibraryItem,
  getLibraryItems,
  deleteLibraryItem
} = require('../controllers/libraryController');

const { isAuthenticated, isRole } = require('../middleware/authMiddleware');

// DEBUG CHECK
console.log('typeof uploadLibraryItem:', typeof uploadLibraryItem);
console.log('typeof verifyToken:', typeof isAuthenticated);
console.log('typeof verifyAdmin:', typeof isRole);

// 🔒 ADMIN: Upload book or syllabus
router.post('/upload', isAuthenticated, isRole, uploadLibraryItem);

// 👨‍🎓 STUDENT: View all library items
router.get('/', getLibraryItems);

// 🔒 ADMIN: Delete book or syllabus
router.delete('/:id', isAuthenticated, isRole, deleteLibraryItem);

module.exports = router;
