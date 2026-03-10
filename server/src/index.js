import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import routes from './routes.js'

const app = express()

try {
    await mongoose.connect(process.env.MONGO_URI, {dbName: 'anime-list-project'})
    console.log("Succesfully connected to database!") 
} catch (error) {
    console.log("Failed to connect to database", error.message);
}

app.use(cors())
app.use(express.json());
app.use(cookieParser())

app.use(routes)

app.listen(1298, () => console.log('Server is listening on port http://localhost:1298......'))