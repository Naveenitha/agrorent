const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createBooking,
  getBookings,
  updateBookingStatus,
  getMyBookings,
  getOwnerBookings
} = require("../controllers/bookingController");


// Farmer creates booking
router.post("/", protect, authorize("farmer"), createBooking);

// Owner view bookings for their equipment
router.get("/owner", protect, authorize("owner"), getOwnerBookings);

// Admin / Owner view all bookings
router.get("/", protect, getBookings);

// Farmer view his bookings
router.get("/mybookings", protect, authorize("farmer", "owner"), getMyBookings);

// Owner updates booking status
router.put("/:id/status", protect, authorize("owner"), updateBookingStatus);

module.exports = router;