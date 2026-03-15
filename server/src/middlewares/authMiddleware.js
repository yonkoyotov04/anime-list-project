import 'dotenv/config'
import jwt from 'jsonwebtoken'

export default function authMiddleware(req, res, next) {
    const token = req.header('X-Authorization');

    if (!token) {
        next();
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;
        req.isAuthenticated = true;
        req.isAdmin = user.email === 'jjotov488@gmail.com' ? true : false;

        next()
    } catch (error) {
        res.status(401).end();
    }
}

export function isAuth(req, res, next) {
    if (!req.isAuthenticated) {
        return res.status(401);
    }

    next();
}

export function isGuest(req, res, next) {
    if (req.isAuthenticated) {
        return res.status(403);
    }

    next();
}