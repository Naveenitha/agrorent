const Equipment = require("../models/Equipment");


// Get all available equipment (for farmers)
exports.getAvailableEquipment = async (req, res) => {

  try {

    const equipments = await Equipment.find({ available: true })
      .populate("owner", "name email");

    res.json(equipments);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Get all equipment
exports.getEquipments = async (req, res) => {

  try {

    const equipments = await Equipment.find()
      .populate("owner", "name email");

    res.json(equipments);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Add equipment (owner)
exports.addEquipment = async (req, res) => {

  try {

    const equipment = await Equipment.create({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      pricePerHour: Number(req.body.pricePerHour),
      location: req.body.location,
      image: req.file ? req.file.filename : null,
      owner: req.user.id,
      startDate: req.body.startDate || null,
      endDate: req.body.endDate || null,
      startTime: req.body.startTime || null,
      endTime: req.body.endTime || null
    });

    res.status(201).json({
      message: "Equipment added successfully",
      equipment
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Get equipment by ID
exports.getEquipmentById = async (req, res) => {

  try {

    const equipment = await Equipment.findById(req.params.id)
      .populate("owner", "name email");

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found"
      });
    }

    res.json(equipment);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Get equipment added by logged-in owner
exports.getMyEquipment = async (req, res) => {

  try {

    const equipments = await Equipment.find({
      owner: req.user.id
    });

    res.json(equipments);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Search equipment
exports.searchEquipment = async (req, res) => {

  try {

    const { location, category } = req.query;

    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    const equipments = await Equipment.find(filter)
      .populate("owner", "name email");

    res.json(equipments);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Update equipment
exports.updateEquipment = async (req, res) => {

  try {

    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found"
      });
    }

    // Owner authorization check
    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this equipment"
      });
    }

    const updateData = {
      ...req.body
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedEquipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      message: "Equipment updated successfully",
      equipment: updatedEquipment
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Delete equipment
exports.deleteEquipment = async (req, res) => {

  try {

    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found"
      });
    }

    // Owner authorization check
    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to delete this equipment"
      });
    }

    await Equipment.findByIdAndDelete(req.params.id);

    res.json({
      message: "Equipment deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
