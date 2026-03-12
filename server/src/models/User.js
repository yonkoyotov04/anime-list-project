import { Schema, Types } from "mongoose";
import Anime from "./Anime.js";

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "An email is required!"],
        minLength: [10, "Your email is too short!"],
        match: [/@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/, "Your email is invalid"]
    },
    username: {
        type: String,
        required: [true, "A username is required!"],
        minLength: [3, "Your username is too short!"]
    },
    password: {
        type: String,
        required: [true, "A password is required!"],
        minLength: [6, "Your password is too short!"],
        match: [/^[a-zA-Z0-9]+$/, "Your password can only include letters and numbers!"]
    },
    bio: {
        type: String,
        required: false
    },
    profilePic: {
        type: String,
        match: [/^https?:\/\//, "Image URL is invalid!"]
    },
    animeList: [
        {
            animeId: {
                type: Types.ObjectId,
                ref: Anime
            },
            status: {
                type: String,
                enum: ['Watching', 'Completed', 'Dropped'],
                default: 'Watching'
            }
        }
    ]
})