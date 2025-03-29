import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./routes/messageRouter.js";
import userRouter from "./routes/userRouter.js";


const app=express();
dotenv.config({path:"./config/config.env"})


app.use(cors({
    origin:[process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods:["GET","POST","DELETE","PUT","PATCH"],
    credentials:true,
})
)

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
})
);


// app.use("/", userRouter);
app.use("/api/v1/user", messageRouter);
app.use("/api/v1/user", userRouter);



dbConnection()
app.use(errorMiddleware)

export default app;