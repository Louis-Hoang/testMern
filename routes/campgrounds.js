const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const { campgroundSchema } = require("../schemas.js");
const Music = require("../models/music");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const { uploadImage } = require("../aws-s3/index");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

router
    .route("/")
    .get(catchAsync(campgrounds.index))
    .post(
        isLoggedIn,
        uploadImage.array("image"),
        validateCampground,
        catchAsync(campgrounds.createCampground)
    );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
    .route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(
        isLoggedIn,
        isAuthor,
        uploadImage.array("image"),
        validateCampground,
        catchAsync(campgrounds.updateCampground)
    )
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
