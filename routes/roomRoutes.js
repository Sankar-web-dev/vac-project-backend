const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { createRoom, getRooms, deleteRoom, updateRoom } = require("../controllers/roomController");

// Only warden can create room
router.post("/", protect, authorize("warden"), createRoom);

// Both warden & student can view rooms
router.get("/", protect, authorize("warden", "student"), getRooms);

// Only warden can delete/update room
router.delete("/:id", protect, authorize("warden"), deleteRoom);

// Only warden can update room
router.put("/:id", protect, authorize("warden"), updateRoom);

module.exports = router;