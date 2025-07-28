const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Teacher submits a result
router.post('/', isAuthenticated, resultController.recordResult);

// Get all students for dropdown (teacher dashboard)
router.get('/students', isAuthenticated, resultController.getAllStudents);

// Get all results entered by the logged-in teacher
router.get('/my-results', isAuthenticated, resultController.getTeacherResults);

// Get results for a specific student (could be teacher or student viewing)
router.get('/:studentId', isAuthenticated, resultController.getStudentResults);

module.exports = router;
