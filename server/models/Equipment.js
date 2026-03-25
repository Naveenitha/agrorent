const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    pricePerHour: {
        type: Number,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    image: {
        type: String
    },

    available: {
        type: Boolean,
        default: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    startDate: {
        type: Date,
        default: null
    },

    endDate: {
        type: Date,
        default: null
    },

    startTime: {
        type: String,
        default: null
    },

    endTime: {
        type: String,
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model("Equipment", equipmentSchema);