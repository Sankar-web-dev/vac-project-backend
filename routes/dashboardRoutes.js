const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/authMiddleware");

console.log("Dashboard routes loaded");

router.get("/dashboard", protect, authorize("warden"), getDashboardStats);

module.exports = router;
