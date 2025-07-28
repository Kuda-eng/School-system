const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isRole } = require('../middleware/authMiddleware');

router.post('/add-user', isAuthenticated, isRole(['admin']), adminController.addUser);
router.get('/all-users', isAuthenticated, isRole(['admin']), adminController.getAllUsers);
router.post('/set-fee', isAuthenticated, isRole(['admin']), adminController.setStudentFee);
router.get('/all-fees', isAuthenticated, isRole(['admin']), adminController.getAllFees);
router.post('/record-payment', isAuthenticated, isRole(['admin']), adminController.recordPayment);

module.exports = router;
