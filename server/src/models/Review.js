import { model, Schema, Types } from "mongoose";

const reviewSchema = new Schema({
    anime: {
        type: Types.ObjectId,
        ref: "Anime",
        required: [true, "An anime is required!"]
    },
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, "A user is required!"]
    },
    rating: {
        type: Number,
        min: [1, "Rating is too low!"],
        max: [10, "Rating is too high!"],
        required: [true, "A rating is required!"]
    },
    comment: {
        type: String,
        minLength: [3, 'Comment is too short!'],
        required: [true, "A comment is required!"]
    }
})

const Review = model('Review', reviewSchema);

export default Review;