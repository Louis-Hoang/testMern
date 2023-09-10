const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");
const ExpressError = require("../utils/ExpressError");
const Music = require("../models/music");
const Review = require("../models/review.js");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    catchAsync(reviews.deleteReview)
);

module.exports = router;
