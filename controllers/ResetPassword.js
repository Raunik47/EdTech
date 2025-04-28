// flow of this is we click on forget oassword then it will take to the page where  you will get the link to generate which is send om mail then on clicking u will gett the ui to enter the new link

// how we procede 1st we will generate the link and send on the mail and in 2nd flow u will get ui on which u will click on new password

// for reset password u will require the user so import user
const User = require("../models/User");
// we also require mailsender
const mailSender = require("../utils/mailSender");
const { login } = require("./Auth");

// resetpassword

exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from the request body
    const { email } = req.body;
    // check user for this email,email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user is not found as email is not registered",
      });
    }

    // genertae token with expiry time
    const token = crypto.randomUUID();

    // update user by adding token and expiry time
    // before that find user ki kis kaun se user ko update krna hai
    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      // this will return the updated response
      { new: true }
    );

    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail containing the url
    await mailSender(
      email,
      "password reset Link",
      `password Reset Link : ${url}`
      // we are taking ${url} because each user have diffrent different link  so time to time link change so thats why we use ``
    );
    // return response
    return res.json({
      success: true,
      message: "Email sent Successfully,please check email and change pwd",
    });

    // create link forthe ui that display the password change ui
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset password  mail",
    });
  }
};

// resetPassword
exports.resetPassword = async (req, res) => {
  try {
    // for this three thing will comes 1st password ,2nd confirmpasssword and third token
  //  use of token in user model because  to  get  the user entry and insert new password inside the user


  //  data fetch
  const {password,confirmPassword,token} =req.body;

  //   validation 
  if(password !==confirmPassword){
      return res.json({
          success:false,
          message:"Password is not matching",   
         })
  }
    // get user details from db using token
    const userDetails=await User.findOne({token:token});
    // if not entry -means token is invalid
    if(!userDetails){
      return res.json({
          success:false,
          message:"Token is invalid",
      })
    }
    // check expire time of token
    if(userDetails.resetPasswordExpires < Date.now()){
  
      return res.json({
          success:false,
          message:"Token is expired , please regenerate your token",   
         })
    }
    // hash the password
    const hashedPassword=await bcrypt.hash(password,10);
  
    // update the password
    await User.findOneAndUpdate(
      {token:token},
      {password:hashedPassword},
      {new:true},
    );
  //   return response 
  return res.status(200).json({
      success:true,
      message:"Password is reset succes full",   
     })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Something went wrong while sending reset password mail"
    })
    
  }
};
