const Music = require("../models/music");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    const campground = await Music.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Music.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });
    await Review.findByIdAndRemove(reviewId);
    req.flash("success", "Successfully delete review");
    res.redirect(`/campgrounds/${id}`);
};
