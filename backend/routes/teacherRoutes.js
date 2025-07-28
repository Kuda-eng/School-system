const teacherController = require('../controllers/teacherController');

router.post('/record-grade', isAuthenticated, isRole(['teacher']), teacherController.recordGrade);
router.get('/grades', isAuthenticated, isRole(['teacher']), teacherController.getAllGrades);
router.put('/grades/:id', isAuthenticated, isRole(['teacher']), teacherController.updateGrade);
router.delete('/grades/:id', isAuthenticated, isRole(['teacher']), teacherController.deleteGrade);
