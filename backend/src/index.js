import connectDB from "./db/database.js";
import {app} from "./app.js"
import dotenv from "dotenv"
import { seedDefaultSession } from "./Utils/seedDefault.js";



dotenv.config({
    path:"./.env"
})


const PORT=process.env.PORT || 8000;

connectDB()
.then(async()=>{
    await seedDefaultSession();
    app.on("error",(error)=>{
        console.log("express Error",error);
        throw error
    })
    app.listen(PORT, ()=>{
        console.log(`Server Started and running at ${process.env.PORT || 8000} `)
    })
}).catch((error)=>{
    console.log(
        "MongoDB Connection FAILED!",error
    )
})