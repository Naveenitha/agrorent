const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  addEquipment,
  getEquipments,
  getEquipmentById,
  getMyEquipment,
  getAvailableEquipment,
  searchEquipment,
  updateEquipment,
  deleteEquipment
} = require("../controllers/equipmentController");


// Add equipment (owner only)
router.post(
  "/",
  protect,
  authorize("owner"),
  upload.single("image"),
  addEquipment
);


// Get all equipment
router.get("/", getEquipments);


// Get available equipment (for farmers)
router.get("/available", getAvailableEquipment);


// Search equipment
router.get("/search", searchEquipment);


// Owner's equipment
router.get(
  "/myequipment",
  protect,
  authorize("owner"),
  getMyEquipment
);


// Update equipment
router.put(
  "/:id",
  protect,
  authorize("owner"),
  upload.single("image"),
  updateEquipment
);


// Delete equipment
router.delete(
  "/:id",
  protect,
  authorize("owner"),
  deleteEquipment
);


// Get equipment by ID (keep last to avoid route conflicts)
router.get("/:id", getEquipmentById);


module.exports = router;