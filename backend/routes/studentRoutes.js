const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { isAuthenticated, isRole } = require('../middleware/authMiddleware');

router.get('/my-fee', isAuthenticated, isRole(['student']), studentController.getMyFee);

module.exports = router;
router.get('/my-payments', isAuthenticated, isRole(['student']), studentController.getMyPaymentHistory);
router.get('/my-grades', isAuthenticated, isRole(['student']), studentController.getMyGrades);
