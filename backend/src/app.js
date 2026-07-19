import express from "express";
import cors from "cors";

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true

}))

app.use(express.json({
    limit:"16kb"
}))

app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Retron-BMS-DASHBOARD API is running"
    })
})


//router import
import sessionRoutes from "./routes/session.routes.js"

app.use("/api/sessions",sessionRoutes)






export { app }