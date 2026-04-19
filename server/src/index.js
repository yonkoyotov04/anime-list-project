import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import routes from './routes.js'
import authMiddleware from './middlewares/authMiddleware.js'

const app = express();

try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'anime-list-project' });
    console.log("Succesfully connected to database!");
} catch (error) {
    console.log("Failed to connect to database", error.message);
}

app.use(cors({
    origin: [
        'https://anime-list-project-ten.vercel.app',
        'http://localhost:4200'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-Authorization', 'isAuth']
}));

app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

app.use(routes);

app.listen(1298, '0.0.0.0', () => console.log('Server is running'));

process.env.PORT