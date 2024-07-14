import express from "express";
import dotenv from 'dotenv'
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoute from './routes/userRoute.js'
import postRoute from './routes/postRoute.js'
import messageRoute from './routes/messageRoute.js'
import { v2 as cloudinary } from 'cloudinary'
import { app, server } from "./socket/socket.js"
dotenv.config()

connectDB()

//const app = express();

const PORT = process.env.PORT || 8000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

app.use(express.json({ limit: "50mb" })) // to parse JSON data in the req.body
app.use(express.urlencoded({ extended: false })) //to parse form data in the req.body
app.use(cookieParser())
//Routes
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/message', messageRoute)

server.listen(PORT, () => console.log(`server started at port ${PORT} `))

