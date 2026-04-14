import 'dotenv/config'
import jwt from 'jsonwebtoken'

export default function authMiddleware(req, res, next) {
    const token = req.header('X-Authorization');

    if (!token) {
        return next();
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;
        req.isAuthenticated = true;

        return next();
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