const mongoose= require("mongoose");
const { resetPasswordToken } = require("../controllers/ResetPassword");

const userSchema= new mongoose.Schema({

    firstName: {
        type:String,
        required:true,
        trim: true,
    },
    lastNmae: {
        type:String,
        required:true,
        trim:true,
    },
    email : {
        type:String,
        require:true,
        trim: true,
    },
    password : {
        type:String,
        require:true,
        
    },
    accountType : {
        type:String,
        required:true,
       enum :["Admin","Student" ,"Instructor"],
    },
    additionalDetails : {
        type: mongoose.Schema.Types.ObjectId,
        required:type,
        ref:"Profile",
    },
    courses : [ {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course",
    } ],
    image: {
        type: String,
        required:true,

    },
    token :{
        type:String,
    },
    resetPasswordExpires:{
type:Date
    },

    courseProgress :[ {
        type:mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress",
    } ]

})

module.export= mongoose.model ("User",userSchema);