import { Router } from "express";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";
import userService from "../services/userService.js";
import { getErrorMessage } from "../utils/errorUtil.js";
import jwt from 'jsonwebtoken';
import { generateAuthToken } from "../utils/tokenUtil.js";
import reviewService from "../services/reviewService.js";

const userController = Router();

userController.get('/wake', (req, res) => {
    res.status(200).send('Wake up!');
})

userController.post('/register', isGuest, async (req, res) => {
    let userData = req.body;

    userData['email'] = userData.email.trim();
    userData['password'] = userData.password.trim();
    userData['username'] = userData.username.trim();
    userData['bio'] = userData.bio.trim();
    userData['profilePic'] = userData.profilePic.trim();

    try {
        const { user, refreshToken } = await userService.register(userData);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 14 * 24 * 60 * 60 * 1000
        })

        res.status(201).json(user);
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.statusMessage = errorMessage;
        res.status(400).json({ message: errorMessage });
    }
})

userController.post('/login', isGuest, async (req, res) => {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    try {
        const { user, refreshToken } = await userService.login(email, password);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 14 * 24 * 60 * 60 * 1000
        })

        res.status(201).json(user);
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.statusMessage = errorMessage;
        res.status(400).json({ message: errorMessage });
    }
})

userController.get('/refresh', async (req, res) => {
    const token = req.cookies['refreshToken'];

    if (!token) {
        return res.sendStatus(401);
    }

    const decodedToken = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
    const newToken = generateAuthToken(decodedToken);

    res.status(201).json({ accessToken: newToken });
})

userController.get('/logout', isAuth, (req, res) => {
    console.log("In logout");
    res.clearCookie('refreshToken');
    res.sendStatus(204);
})

userController.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const userData = await userService.getUserData(userId);

    res.status(200).json(userData);
})

userController.put('/:userId', isAuth, async (req, res) => {
    const userId = req.params.userId;
    const userData = await userService.getUserData(userId);
    let newData = req.body;

    newData['username'] = newData.username.trim();
    newData['bio'] = newData.bio.trim();
    newData['profilePic'] = newData.profilePic.trim();

    try {
        const editedUser = await userService.editProfile(userId, {
            email: userData.email,
            password: userData.password,
            animeList: userData.animeList,
            ...newData
        });
        res.status(201).json(editedUser ?? {});
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.statusMessage = errorMessage;
        res.status(401).json({ message: errorMessage });
    }
})

userController.put('/password/:userId', isAuth, async (req, res) => {
    const userId = req.params.userId;
    const newPasswordData = req.body;

    const currentPassword = newPasswordData.currentPassword.trim();
    const newPassword = newPasswordData.newPassword.trim();
    const repeatNewPassword = newPasswordData.reNewPassword.trim();

    try {
        await userService.editPassword(userId, currentPassword, newPassword, repeatNewPassword)
        res.status(200).end();
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.statusMessage = errorMessage;
        res.status(401).json({ message: errorMessage });
    }
})

userController.delete('/:userId', isAuth, async (req, res) => {
    const userId = req.params.userId;

    try {
        await reviewService.deleteReviewsForUser(userId);
        await userService.deleteProfile(userId);

        res.status(200).end();
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).json({ message: 'Failed to delete profile!' });
    }
})

userController.get('/:userId/list', isAuth, async (req, res) => {
    const userId = req.params.userId;

    try {
        const animeList = await userService.getAllAnimesForList(userId);
        res.status(200).json(animeList ?? [])
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).json({ message: 'Failed to get anime list!' });
    }
})

userController.put('/:animeId/watch', isAuth, async (req, res) => {
    const userId = req.user?.id;
    const animeId = req.params.animeId;

    try {
        await userService.addAnimeToWatched(userId, animeId);
        res.status(200).end();
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).json({ message: 'Failed to add anime to watched!' });
    }
})

userController.put('/:animeId/remove', isAuth, async (req, res) => {
    const userId = req.user?.id;
    const animeId = req.params.animeId;

    try {
        await userService.removeAnimeFromList(userId, animeId);
        res.status(200).end();
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).json({ message: 'Failed to remove anime from list!' });
    }
})

userController.put('/:animeId/complete', isAuth, async (req, res) => {
    const userId = req.user?.id;
    const animeId = req.params.animeId;

    try {
        await userService.completeAnime(userId, animeId);
        res.status(200).end();
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).json({ message: 'Failed to complete anime!' });
    }
})

userController.put('/:animeId/drop', isAuth, async (req, res) => {
    const userId = req.user?.id;
    const animeId = req.params.animeId;

    try {
        await userService.dropAnime(userId, animeId);
        res.status(200).end();
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).json({ message: 'Failed to drop anime!' });
    }
})

export default userController;

