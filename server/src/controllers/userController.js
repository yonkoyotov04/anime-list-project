import { Router } from "express";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";
import userService from "../services/userService.js";
import { getErrorMessage } from "../utils/errorUtil.js";
import jwt from 'jsonwebtoken';
import { generateAuthToken } from "../utils/tokenUtil.js";
import reviewService from "../services/reviewService.js";

const userController = Router();

userController.post('/register', isGuest, async (req, res) => {
    let userData = req.body;

    userData['email'] = userData.email.trim();
    userData['password'] = userData.password.trim();
    userData['username'] = userData.username.trim();
    userData['bio'] = userData.bio.trim();
    userData['profilePic'] = userData.profilePic.trim();

    try {
        const {user, refreshToken} = await userService.register(userData);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 14 * 24 * 60 * 60 * 1000
        })

        res.status(201).json(user);
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).end();
    }
})

userController.post('/login', isGuest, async (req, res) => {
    const {email, password} = req.body;

    email = email.trim();
    password = password.trim();

    try {
        const {user, refreshToken} = await userService.login(email, password);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 14 * 24 * 60 * 60 * 1000
        })

        res.status(201).json(user);
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).end();
    }
})

userController.get('/:userId', isAuth, async(req, res) => {
    const userId = req.params.userId;
    const userData = await userService.getUserData(userId);

    res.status(200).json(userData);
})

userController.post('/refresh', async (req, res) => {
    const token = req.cookies['refreshToken'];

    if (!token) {
        return res.sendStatus(401);
    }

    const decodedtoken = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
    const newToken = generateAuthToken(decodedtoken);

    res.status(201).json(newToken);
})

userController.post('/logout', isAuth, (req, res) => {
    res.clearCookie('refreshToken');
    res.sendStatus(204);
})

userController.put('/:userId', isAuth, async (req, res) => {
    const userId = req.params.userId;
    let newData = req.body;

    newData['username'] = newData.username.trim();
    newData['bio'] = newData.bio.trim();
    newData['profilePic'] = newData.profilePic.trim();

    try {
        await userService.editProfile(userId, newData);
        res.json({});
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(401).end();
    }
})

userController.put('/:userId/password', isAuth, async (req, res) => {
    const userId = req.params.userId;
    const newPasswordData = req.body;

    const currentPassword = newPasswordData.currentPassword.trim();
    const newPassword = newPasswordData.newPassword.trim();
    const repeatNewPassword = newPasswordData.repeatPassword.trim();;

    try {
        await userService.editPassword(userId, currentPassword, newPassword, repeatNewPassword)
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(401).end();
    }
})

userController.delete('/:userId', isAuth, async (req, res) => {
    const userId = req.params.userId;

    try {
        await reviewService.deleteReviewsForUser(userId);
        await userService.deleteProfile(userId);
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(401).end();
    }
})

userController.get('/wake', (req, res) => {
    res.status(200).send('Wake up!');
})

export default userController;

