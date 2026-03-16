const Booking = require("../models/booking");
const Equipment = require("../models/Equipment");


// Create booking
exports.createBooking = async (req, res) => {

  try {

    console.log("createBooking called with body:", req.body);

    const { equipment, startDate, endDate, hours, totalPrice } = req.body;

    const equipmentData = await Equipment.findById(equipment);

    if (!equipmentData) {
      return res.status(404).json({
        message: "Equipment not found"
      });
    }

    if (!equipmentData.available) {
      return res.status(400).json({
        message: "Equipment not available"
      });
    }

    const existingBooking = await Booking.findOne({
      equipment: equipment,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Equipment already booked for selected dates. Please select different dates."
      });
    }

    // Check if equipment has custom unavailability dates set by owner
    
    if (equipmentData.startDate && equipmentData.endDate) {
      const eqStart = new Date(equipmentData.startDate);
      const eqEnd = new Date(equipmentData.endDate);
      const reqStart = new Date(startDate);
      const reqEnd = new Date(endDate);
      
      // Check if requested dates overlap with equipment's unavailable dates
      if (reqStart <= eqEnd && reqEnd >= eqStart) {
        let message = "Equipment is not available for the selected dates.";
        
        if (equipmentData.startTime && equipmentData.endTime) {
          message += ` Please book between ${equipmentData.startTime} and ${equipmentData.endTime}.`;
        } else {
          message += ` Equipment is unavailable from ${eqStart.toLocaleDateString()} to ${eqEnd.toLocaleDateString()}.`;
        }
        
        return res.status(400).json({
          message: message
        });
      }
    }

    const booking = await Booking.create({
      user: req.user.id,
      equipment,
      startDate,
      endDate,
      hours,
      totalPrice,
      status: "pending"
    });

    // Don't set equipment as unavailable until booking is confirmed
    // equipmentData.available = false;
    // await equipmentData.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// Get all bookings (admin view)
exports.getBookings = async (req, res) => {

  try {

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("equipment", "name category location");

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// Owner dashboard bookings
exports.getOwnerBookings = async (req, res) => {

  try {

    console.log("getOwnerBookings called, user:", req.user.id);

    const equipments = await Equipment.find({
      owner: req.user.id
    });

    console.log("Found equipments:", equipments.length);

    const equipmentIds = equipments.map(eq => eq._id);

    console.log("Equipment IDs:", equipmentIds);

    const bookings = await Booking.find({
      equipment: { $in: equipmentIds }
    })
      .populate("user", "name email")
      .populate("equipment", "name category location");

    console.log("Found bookings:", bookings.length);

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// Update booking status
exports.updateBookingStatus = async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const equipment = await Equipment.findById(booking.equipment);

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found for this booking"
      });
    }

    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this booking"
      });
    }

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    const status = req.body.status?.toLowerCase();

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    booking.status = status;

    await booking.save();

    if (status === "confirmed") {
      await Equipment.findByIdAndUpdate(booking.equipment, {
        available: false
      });
    }

    if (status === "completed" || status === "cancelled") {

      await Equipment.findByIdAndUpdate(booking.equipment, {
        available: true
      });

    }

    res.json({
      message: "Booking status updated",
      booking
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// Farmer booking history
exports.getMyBookings = async (req, res) => {

  try {

    const bookings = await Booking.find({
      user: req.user.id
    })
      .populate({
        path: "equipment",
        select: "name category pricePerHour location owner",
        populate: {
          path: "owner",
          select: "name"
        }
      });

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};