const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true
  },

  block: {
    type: String,
    required: true
  },

  floor: {
    type: Number,
    required: true
  },

  capacity: {
    type: Number,
    required: true
  },

  occupants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Room", roomSchema);