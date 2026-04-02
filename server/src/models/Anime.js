import { Schema, model, Types } from "mongoose";

const animeSchema = new Schema({
    title: {
        type: String,
        required: [true, 'An anime title is required!'],
        minLength: [2, "The anime's title is too short!"]
    },
    author: {
        type: String,
        required: [true, 'An author is required!'],
        minLength: [3, "The author's name is too short"]
    },
    producedBy: {
        type: String,
        required: [true, "A publishing company is required!"],
        minLength: [3, 'The production company name is too short!']
    }, 
    genres: {
        type: String,
        required: [true, "A genre is required!"],
        minLength: [3, "The genre's name is too short!"]
    },
    startDate: {
        type: String,
        required: [true, "A start year is required!"],
    },
    endDate: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: [true, 'A description is required!'],
        minLength: [8, 'Description is too short!']
    },
    imageUrl: {
        type: String,
        required: [true, 'An image is required!'],
        match: [/^https?:\/\//, "ImageURL is invalid"]
    },
    currentlyWatched: {
        type: Number,
        default: 0
    },
    completed: {
        type: Number,
        default: 0
    },
    dropped: {
        type: Number,
        default: 0
    },
    ownerId: {
        type: Types.ObjectId
    }
})

const Anime = model('Anime', animeSchema);

export default Anime;