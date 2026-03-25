const Review = require("../models/review");

exports.addReview = async (req, res) => {

  try {

    const review = await Review.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json(review);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


exports.getReviews = async (req, res) => {

  try {

    const reviews = await Review.find({
      equipment: req.params.equipmentId
    });

    res.json(reviews);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};