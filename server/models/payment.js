const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  paymentId: {
    type: String
  },

  razorpayOrderId: {
    type: String
  },

  razorpaySignature: {
    type: String
  },

  status: {
    type: String,
    enum: ["success", "failed"],
    default: "success"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Payment", paymentSchema);