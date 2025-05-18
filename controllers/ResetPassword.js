// flow of this is we click on forget oassword then it will take to the page where  you will get the link to generate which is send om mail then on clicking u will gett the ui to enter the new link

// how we procede 1st we will generate the link and send on the mail and in 2nd flow u will get ui on which u will click on new password

// for reset password u will require the user so import user
// const User = require("../models/User");
// // we also require mailsender
// const mailSender = require("../utils/mailSender");
// const { login } = require("./Auth");



// // resetpassword

const User=require("../models/User");
const jwt=require("jsonwebtoken");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt");
const crypto=require("crypto");
//reset Password Token -->send mail
exports.resetPasswordToken=async(req,res)=>{
  try{
    //get email from req body
    const email=req.body.email;
    //Check if user exists or not , validation as well
    const user=await User.findOne({email:email});
    if(!user){
      return res.json({
        success:false,
        message:"Your email is not registered with us"
      });
    }
    //token generate
    const token=crypto.randomUUID();
    console.log(token);
    //update user by adding token and expiration time
    const updatedDetails=await User.findOneAndUpdate({email:email},{
      token:token,
      resetPasswordExpires:Date.now() + 5*60*1000,
    },{
      new:true
    });
    console.log("DB ENTRY CREATED");
    //create url
    const url=`http://localhost:3000/update-password/${token}`;
    //send mail with url
    await mailSender(email,"Password Reset Link",`Password Reset Link: ${url}`);
    //return response
    return res.json({
      success:true,
      message:"Email sent successfully,please check email and reset password",
    });

  }
  catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Something went wrong while sending reset password mail"
    })
  }
}


//restPassword->create entry in db
exports.resetPassword=async(req,res)=>{
  try{
    //data fetch
    const {password,confirmPassword,token}=req.body;
    //validation
    if(password!==confirmPassword){
      return res.json({
        success:false,
        message:"Passwords did not match,try again",
      })
    }
    //get user details from db using token
    const userDetails=await User.findOne({token:token});

    //if no entry -> invalid token
    if(!userDetails){
      return res.json({
        success:false,
        message:"Token invalid"
      })
    }

    //check if expired token
    if(userDetails.resetPasswordExpires<Date.now()){
      return res.json({
        success:false,
        message:"Token is expired,please regenerate your token"
      })
    }
    //password hash
    const hashedPassword=await bcrypt.hash(password,10);
    //password update
    await User.findOneAndUpdate({token:token},{
      password:hashedPassword
    },{new:true});
    //return response
    return res.status(200).json({
      success:true,
      message:"Password reset successful",
    })

  }
  catch(err){
    console.log(err); 
    console.log(err.message);
    return res.json({
      success:false,
      message:"Some error occurred while resetting the password"
    })
    

  }
}