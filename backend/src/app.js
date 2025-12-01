import dotenv from "dotenv";
dotenv.config();

import express, { request } from "express";
import {createServer} from "node:http";
import connectToSocket from "./controllers/socketManager.js";

import { Server } from "socket.io";

import mongoose, { mongo } from "mongoose";

import cors from "cors";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

const start = async ()=>{
    // app.set('mong_user');
    const mongoURL = process.env.MONGODB_URI
    // console.log(mongoURL)
    const connectionDB = await mongoose.connect(mongoURL)
    console.log("DB connection name: ", connectionDB.connection.name)
        server.listen(app.get('port'), ()=>{
        console.log("app listen on port 8000")
    });
}

start();