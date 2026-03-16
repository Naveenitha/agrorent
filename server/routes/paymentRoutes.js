const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createOrder,
  verifyPayment,
  getPayments,
  makePayment
} = require("../controllers/paymentController");

// Routes for Razorpay payment flow
router.post("/create-order", protect, authorize("farmer"), createOrder);
router.post("/verify", protect, authorize("farmer"), verifyPayment);

// Get payments (for the logged-in user)
router.get("/", protect, getPayments);

// Dummy payment (backward compatibility)
router.post("/", protect, authorize("farmer"), makePayment);

module.exports = router;