const Music = require("../models/music");
const mongoose = require("mongoose");
const { s3 } = require("../aws-s3/index");
const { DeleteObjectsCommand } = require("@aws-sdk/client-s3");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

module.exports.index = async (req, res) => {
    const campgrounds = await Music.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
    const campground = new Music(req.body.campground);
    campground.images = req.files.map((f) => ({
        url: f.location,
        filename: f.key,
    }));
    campground.author = req.user._id;

    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    if (mongoose.isValidObjectId(id)) {
        const campground = await Music.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                },
            })
            .populate("author");
        if (!campground) {
            req.flash("error", "Cannot find that campground!");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    } else {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Music.findById(id);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Music.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    const imgs = req.files.map((f) => ({
        url: f.location,
        filename: f.key,
    }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        const command = new DeleteObjectsCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
                Objects: req.body.deleteImages.map((e) => ({ Key: e })),
            },
        });
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        }); //Delete on Db
        await s3.send(command); //delete on S3
    }
    req.flash("success", "Successfully Updated");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Music.findByIdAndDelete(id);
    if (campground.images) {
        const command = new DeleteObjectsCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
                Objects: campground.images.map((e) => ({ Key: e.filename })),
            },
        });
        await s3.send(command);
    }
    req.flash("success", "Successfully delete campground");
    res.redirect("/campgrounds");
};
