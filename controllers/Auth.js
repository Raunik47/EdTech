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

// signup
exports.signUp= async(res,req) =>{

  // data fetch from body
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    contactNumber,
    otp
  }=req.body;
  // validate check
  if(!firstName || !lastName || !email || !password || !confirmPassword || !top ){
    return res.status(403).json ({
      success:false,
      message: "All field are required"
    })
  }
  // 2 password match karlo 
  if(password !== confirmPassword) {
    return res.status(400).json ({
      success:false,
      message: "password and the confirmpassword does not match"
    });
  }
  // check user already exist 
  const existingUser = await User.findOne({email});
  if(existingUser){
    return res.status(400).json ({
      success:false,
      message: "User is already registerd"
    });
  }

  // find most recent OTP stored for the user

  const recentOtp = await OTP.find({email}).sort({createAt :-1}).limit(1);
  console.log(recentOtp);

  // validate OTP
if(recentOtp.length == 0){
  // otp not found
return res.status(400).json({
  success:false,
  message:"OTP found",
})
} 
else if(otp !== recentOtp.otp){
  // invalid OTP
  return res.status(400).json({
    success:false,
    message:"OTP found",
  });
}

// hash password
const hashedPassword =await bcrypt.hash(password,10);

// entry create in DB
}
