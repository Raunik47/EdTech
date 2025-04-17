const User = require("../models/User");
const OTP = require("../models/User");

// send otp
exports.sendOTP = async (requestAnimationFrame, res) => {
    try {
          // fetch email from request body
        const { email } = req.body;

        // check if user already exist
        const checkUserPresent = await User.findOne({ email });
      
        // ifuser akready exist,then returna response
      
        if (checkUserPresent) {
          return res.status(401).json({
            success: false,
            message: "user already register",
          });
        }
      
        // generateotp
        var otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          loweCaseAlphabets: false,
          specialChar: false,
        });
        console.log("OTP generated", otp);
      
        // check unique otp or not
        const result = await OTP.findOne({ otp: otp });
        while (result) {
          otp = otpGenerator =
            (6,
            {
              upperCaseAlphabets: false,
              loweCaseAlphabets: false,
              specialChar: false,
            });
          result = await OTP.findOne({ otp: otp });
        }
      
         // fetch email from request body
 const otpPayload= {email,otp};

 //  create an entry for otp
 const otpBody=await OTP.create(otpPayload);
 console.log(otpBody);
 
 // return response 
 res.status(200).json({
     success:true,
     message:"OTP sent Succesfully",
     otp,
 })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
           success:false,
           message:error.message ,
        })
        
    }
 

  
};
