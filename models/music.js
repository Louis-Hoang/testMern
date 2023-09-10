const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
    const url =
        process.env.ImageKit_Endpoint +
        this.filename +
        "?tr=w-200,h-150,f-png,lo-true";
    return url;
});
const musicSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});
musicSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});
module.exports = mongoose.model("Music", musicSchema);
