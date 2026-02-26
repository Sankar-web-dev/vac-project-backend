const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint
} = require("../controllers/complaintController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Student
router.post("/", protect, authorize("student"), createComplaint);
router.get("/me", protect, authorize("student"), getMyComplaints);
router.delete("/:id", protect, authorize("student"), deleteComplaint);

// Warden
router.get("/", protect, authorize("warden"), getAllComplaints);
router.put("/:id", protect, authorize("warden"), updateComplaintStatus);

module.exports = router;