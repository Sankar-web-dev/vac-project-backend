const Student = require("../models/Student");
const Room = require("../models/Room");
const Complaint = require("../models/Complaint");

exports.getDashboardStats = async (req, res) => {
  console.log("Dashboard stats requested");
  try {
    const totalStudents = await Student.countDocuments();
    const totalRooms = await Room.countDocuments();

    const rooms = await Room.find();
    const availableRooms = rooms.filter(
      (room) => room.occupants.length < room.capacity
    ).length;

    const paidStudents = await Student.countDocuments({ feeStatus: "paid" });
    const unpaidStudents = await Student.countDocuments({ feeStatus: "unpaid" });

    const pendingComplaints = await Complaint.countDocuments({ status: "pending" });

    res.json({
      totalStudents,
      totalRooms,
      availableRooms,
      paidStudents,
      unpaidStudents,
      pendingComplaints
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
