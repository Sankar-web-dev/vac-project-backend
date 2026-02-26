const Room = require("../models/Room");

// Create Room
exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, block, floor, capacity } = req.body;

    // Check for duplicate
    const existingRoom = await Room.findOne({ roomNumber, block });
    if (existingRoom) {
      return res.status(400).json({ message: "Room with this room number and block already exists" });
    }

    const room = await Room.create({
      roomNumber,
      block,
      floor,
      capacity
    });

    res.status(201).json(room);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("occupants");
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Room
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Room
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const room = await Room.findByIdAndUpdate(id, updates, { new: true });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};