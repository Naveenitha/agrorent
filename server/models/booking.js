const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
    required: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  hours: {
    type: Number,
    required: true
  },

  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);