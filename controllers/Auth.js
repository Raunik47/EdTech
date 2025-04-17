const User=require("../models/User")
const OTP=require("../models/User")

// send otp
exports.sendOTP=async(requestAnimationFrame,res) =>{
    // fetch email from request body
    const {email}= req.body;

    // check if user already exist
    const checkUserPresent= await User.findOne({email});

    // ifuser akready exist,then returna response

    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"user already register",
        })
    }
}