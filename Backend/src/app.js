import express from "express";

import cors from "cors";

import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}));     //limit json data size
app.use(express.urlencoded({extended: true, limit: "16kb"}));       //converts url symbols as required like '+ 20%'
app.use(express.static("public"));      //store files,images,data on the server side in public folder
app.use(cookieParser());

export {app};