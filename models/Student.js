const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  regNo: {
    type: String,
    required: true,
    unique: true
  },

  department: String,
  year: Number,
  phone: String,
  parentPhone: String,

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },
        feeStatus: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid"
        },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Student", studentSchema);