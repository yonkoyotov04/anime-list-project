import User from "../models/User.js";
import bcrypt from 'bcrypt';
import { generateAuthToken, generateRefeshToken } from "../utils/tokenUtil.js";

export default {
    async register(userData) {
        const userExists = await User.exists({ email: userData.email });
        const usernameExists = await User.exists({ username: userData.username });

        if (userExists) {
            throw new Error('A user with that email already exists!');
        }

        if (usernameExists) {
            throw new Error('Username already taken!');
        }

        if (userData.password !== userData.rePassword) {
            throw new Error('Password mismatch!');
        }

        const user = await User.create(userData);
        const token = generateAuthToken(user);
        const refreshToken = generateRefeshToken(user);

        return {
            user: {
                _id: user.id,
                email: user.email,
                username: user.username,
                bio: user.bio,
                profilePic: user.profilePic,
                animeList: [],
                accessToken: token
            },
            refreshToken
        }
    },

    async login(email, password) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('The email or the password is invalid!');
        }

        const validPassword = bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw new Error('The email or the password is invalid!');
        }

        const token = generateAuthToken(user);
        const refreshToken = generateRefeshToken(user);

        return {
            user: {
                _id: user.id,
                email: user.email,
                username: user.username,
                bio: user.bio,
                profilePic: user.profilePic,
                animeList: [],
                accessToken: token
            },
            refreshToken
        }
    },

    getUserData(userId) {
        return User.findById(userId).select({ username: true, email: true, bio: true, profilePic: true, animeList: true });
    },

    async editProfile(userId, newData) {
        const usernameExists = await User.exists({ username: newData.username, _id: { $ne: userId } });

        if (usernameExists) {
            throw new Error("Username already taken!");
        }

        return User.findByIdAndUpdate(userId, newData, { runValidators: true, new: true });
    },


    async editPassword(userId, currentPassword, newPassword, repeatNewPassword) {
        const user = await User.findById(userId);
        const validPassword = bcrypt.compare(currentPassword, user.password);

        if (!validPassword) {
            throw new Error('Invalid password!');
        }

        if (newPassword !== repeatNewPassword) {
            throw new Error('Password mismatch!');
        }

        user.password = newPassword;

        return await user.save();
    },

    deleteProfile(userId) {
        return User.findByIdAndDelete(userId);
    }
}