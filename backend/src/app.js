import express from "express";
import cors from "cors";
import path from "path"
import { fileURLToPath } from "url";

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true

}))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use(
  "/static",
  express.static(path.join(__dirname, "../public/static"))
);

app.use("/api/sessions",sessionRoutes)
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});





export { app }