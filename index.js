const express=require("express");
const app=express();

const userRoutes=require("./routes/User");
const profileRoutes=require("./routes/Profile");
const paymentRoutes=require("./routes/Payments");
const courseRoutes=require("./routes/Course");

const { connectDatabase } = require("./config/database");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv"); 
dotenv.config();
const {cloudinaryConnect}=require("./config/cloudinary");

const PORT= process.env.PORT || 4000;

// database connect

connectDatabase();

// middleware
app.use(express.json());
app.use(cookieParser());
// this midleware is used to active the backend for frontend request
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"

    })
)
// cloudinary connection
cloudinaryConnect();
// routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payments",paymentRoutes);

// def route
app.get("/",(req,res) =>{
    return res.status(200).json({
        success:true,
        message:"your server is up and running..."
    });
})
app.listen(PORT,()=>{
  console.log(  `App is running succesfully at ${PORT}`)  
})





