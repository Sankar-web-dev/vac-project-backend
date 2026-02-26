const express = require('express');
const router = express.Router();
const { createStudent, getStudents, updateStudent, deleteStudent, getStudent, updateFeeStatus, getRoommates } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only warden can create/update/delete students
router.post("/", protect, authorize("warden"), createStudent);

// Only warden can view students
router.get("/", protect, authorize("warden"), getStudents);

router.get('/me', protect, authorize('student'), getStudent);

router.get('/roommates', protect, authorize('student'), getRoommates);

router.put("/:id", protect, authorize("warden"), updateStudent);
router.delete("/:id", protect, authorize("warden"), deleteStudent);

router.put("/:id/fee", protect, authorize("warden"), updateFeeStatus);
module.exports = router;