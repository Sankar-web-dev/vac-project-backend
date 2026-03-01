const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Student = require("../models/Student");
const Room = require("../models/Room");

// Create Student (Warden Only)
exports.createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      regNo,
      department,
      year,
      phone,
      parentPhone,
      roomId
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check room capacity
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.occupants.length >= room.capacity) {
      return res.status(400).json({ message: "Room is full" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student"
    });

    // Create student profile
    const student = await Student.create({
      user: user._id,
      regNo,
      department,
      year,
      phone,
      parentPhone,
      room: roomId
    });

    // Add student to room occupants
    room.occupants.push(student._id);
    await room.save();

    res.status(201).json({ message: "Student created successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Students (Warden Only)
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'name email')
      .populate('room', 'roomNumber block');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Student (Warden Only)
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { name, email, regNo, department, year, phone, parentPhone } = req.body;

    // Update user if name or email changed
    if (name) await User.findByIdAndUpdate(student.user, { name });
    if (email) await User.findByIdAndUpdate(student.user, { email });

    // Update student
    if (regNo !== undefined) student.regNo = regNo;
    if (department !== undefined) student.department = department;
    if (year !== undefined) student.year = year;
    if (phone !== undefined) student.phone = phone;
    if (parentPhone !== undefined) student.parentPhone = parentPhone;

    await student.save();
    res.json({ message: "Student updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Student (Warden Only)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Remove from room occupants
    if (student.room) {
      await Room.findByIdAndUpdate(student.room, { $pull: { occupants: student._id } });
    }

    // Delete user and student
    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: "Student deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Student Profile (Student Only)
module.exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('user', 'name email').populate('room');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Fee Status (Warden Only)
exports.updateFeeStatus = async (req, res) => {
  try {
    const { feeStatus } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.feeStatus = feeStatus;
    await student.save();

    res.json({ message: "Fee status updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Roommates (Student Only)
exports.getRoommates = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student || !student.room) {
      return res.status(404).json({ message: 'No room assigned' });
    }

    const roommates = await Student.find({ room: student.room, _id: { $ne: student._id } })
      .populate('user', 'name email')
      .populate('room', 'roomNumber block');

    res.json(roommates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};