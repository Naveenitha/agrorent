const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  addReview,
  getReviews
} = require("../controllers/reviewController");

router.post("/", protect, authorize("farmer"), addReview);
router.get("/:equipmentId", getReviews);

module.exports = router;