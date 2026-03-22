import { model, Schema, Types } from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "An email is required!"],
        minLength: [5, "Your email is too short!"],
        maxLength: [30, "Your email is too long!"],
        match: [/@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/, "Your email is invalid"]
    },
    username: {
        type: String,
        required: [true, "A username is required!"],
        minLength: [3, "Your username is too short!"],
        maxLength: [30, "Your username is too long!"]
    },
    password: {
        type: String,
        required: [true, "A password is required!"],
        minLength: [6, "Your password is too short!"],
        maxLength: [20, "Your password is too long!"],
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
                ref: 'Anime'
            },
            status: {
                type: String,
                enum: ['Watching', 'Completed', 'Dropped'],
                default: 'Watching'
            }
        }
    ]
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }
    this.password = await bcrypt.hash(this.password, 12);
})

const User = model('User', userSchema);

export default User;