const Payment = require("../models/payment");
const Booking = require("../models/booking");

// Check if Razorpay is configured
const isRazorpayConfigured = () => {
  return process.env.RAZORPAY_KEY_ID && 
         process.env.RAZORPAY_KEY_SECRET &&
         !process.env.RAZORPAY_KEY_ID.includes("xxxxxxxx");
};

let razorpayInstance = null;

// Initialize Razorpay if configured
if (isRazorpayConfigured()) {
  const Razorpay = require("razorpay");
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { amount, equipmentId, startDate, endDate, hours } = req.body;

    if (!amount || !equipmentId || !startDate || !endDate || !hours) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // If Razorpay is not configured, return mock order
    if (!razorpayInstance) {
      console.log("Razorpay not configured, using mock payment");
      return res.json({
        orderId: "mock_order_" + Date.now(),
        amount: Math.round(amount * 100),
        currency: "INR",
        isMock: true
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        equipmentId,
        startDate,
        endDate,
        hours
      }
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: error.message || "Failed to create payment order" });
  }
};

// Verify payment and create booking
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      equipmentId,
      startDate,
      endDate,
      hours,
      totalPrice,
      isMock
    } = req.body;

    // Handle mock payment (for testing without real Razorpay)
    if (isMock || razorpayOrderId?.startsWith("mock_")) {
      // Create booking
      const booking = await Booking.create({
        user: req.user.id,
        equipment: equipmentId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        hours: parseInt(hours),
        totalPrice: parseFloat(totalPrice),
        status: "pending"
      });

      // Create payment record
      const payment = await Payment.create({
        user: req.user.id,
        booking: booking._id,
        amount: parseFloat(totalPrice),
        paymentId: "mock_" + Date.now(),
        status: "success"
      });

      return res.json({
        message: "Payment successful and booking created",
        booking,
        payment
      });
    }

    // Verify the signature for real payment
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const crypto = require("crypto");
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpayOrderId + "|" + razorpayPaymentId)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }
    }

    // Create booking (status will be pending until owner confirms)
    const booking = await Booking.create({
      user: req.user.id,
      equipment: equipmentId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      hours: parseInt(hours),
      totalPrice: parseFloat(totalPrice),
      status: "pending"
    });

    // Create payment record
    const payment = await Payment.create({
      user: req.user.id,
      booking: booking._id,
      amount: parseFloat(totalPrice),
      paymentId: razorpayPaymentId,
      razorpayOrderId: razorpayOrderId,
      razorpaySignature: razorpaySignature,
      status: "success"
    });

    res.json({
      message: "Payment successful and booking created",
      booking,
      payment
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get payments (for the logged-in user)
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate("booking", "startDate endDate totalPrice status")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dummy payment (always success) - for backward compatibility
exports.makePayment = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Generate fake payment ID
    const paymentId = "PAY_" + Date.now();

    const payment = await Payment.create({
      user: req.user.id,
      booking: bookingId,
      amount: amount,
      paymentId: paymentId,
      status: "success"
    });

    // Update booking status after payment
    booking.status = "confirmed";
    await booking.save();

    res.json({
      message: "Dummy payment successful",
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};