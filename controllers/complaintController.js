const Complaint = require("../models/Complaint");
const Student = require("../models/Student");

// Student raises complaint
exports.createComplaint = async (req, res) => {
  try {
    const { category, description } = req.body;

    const student = await Student.findOne({ user: req.user._id });

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const complaint = await Complaint.create({
      student: student._id,
      category,
      description
    });

    res.status(201).json(complaint);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student sees own complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });

    const complaints = await Complaint.find({ student: student._id });

    res.json(complaints);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Warden sees all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate({
        path: "student",
        populate: { path: "user", select: "name email" }
      });

    res.json(complaints);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Warden updates complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;
    await complaint.save();

    res.json({ message: "Status updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student deletes complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const student = await Student.findOne({ user: req.user._id });

    if (!student || complaint.student.toString() !== student._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({ message: "Complaint deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};