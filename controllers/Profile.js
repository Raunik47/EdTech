// const Profile = require("../models/Profile");
// const User = require("../models/User");

// exports.updateProfile = async (req, res) => {
//   try {
//     // Get input data from request body
//     const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

//     // Get user ID from decoded JWT (middleware sets req.user)
//     const id = req.user.id;

//     // Basic validation
//     if (!contactNumber || !gender || !id) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // Find user and extract profile ID
//     const userDetails = await User.findById(id);
//     const profileId = userDetails.additionalDetails;

//     // Find profile document
//     const profileDetails = await Profile.findById(profileId);

//     // Update profile fields
//     profileDetails.dateOfBirth = dateOfBirth;
//     profileDetails.about = about;
//     profileDetails.gender = gender;
//     profileDetails.contactNumber = contactNumber;
//     await profileDetails.save();

//     // Send success response
//     return res.status(200).json({
//       success: true,
//       message: "Profile Updated Successfully",
//       profileDetails,
//     });
//   } catch (error) {
//     // Handle server error
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// // Delete user account controller
// exports.deleteAccount = async (req, res) => {
//   try {
//     // Get user ID from authenticated request
//     const id = req.user.id;

//     // Validate user exists
//     const userDetails = await User.findById(id);
//     if (!userDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Delete user's profile (additional details)
//     await Profile.findByIdAndDelete({
//       _id: userDetails.additionalDetails, // Changed from 'id' to '_id' as that's the MongoDB convention
//     });

//     // TODO: Unenroll user from all enrolled courses
//     // This would require additional implementation

//     // Delete user account
//     await User.findByIdAndDelete({
//       _id: id, // Changed from 'id' to '_id'
//     });

//     // Return success response
//     return res.status(200).json({
//       success: true,
//       message: "User account deleted successfully",
//     });
//   } catch (error) {
//     // Handle any errors that occur during the process
//     console.error("Error deleting user account:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete user account",
//       error: error.message,
//     });
//   }
// };

// // get all userDetails
// exports.getUserDetails = async (req, res) => {
//   try {
//     // Get user ID from the authenticated request
//     const id = req.user.id;

//     // Find user by ID and populate additional details (like profile information)
//     // The populate() method automatically replaces the specified path with documents from other collections
//     const userDetails = await User.findById(id)
//       .populate("additionalDetails")
//       .exec(); 
//       // exec() executes the query

//     // Check if user exists
//     if (!userDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Return successful response with user data
//     return res.status(200).json({
//       success: true,
//       message: "User Data Fetched Successfully",
//       data: userDetails, // Include the actual user details in the response
//     });
//   } catch (error) {
//     // Handle any errors that occur during the process
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const CourseProgress = require("../models/CourseProgress");
const Profile=require("../models/Profile");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader");
const {convertSecondsToDuration} =require("../utils/secToDuration");
const Course=require("../models/Course")

//Update Profile - No need to create since null fields already present
exports.updateProfile=async(req,res)=>{
  try{
    //data fetch
    const {dateOfBirth="",about="",contactNumber,gender}=req.body;
    const id=req.user.id;
    //data validate
    if(!contactNumber||!gender||!id){
      return res.status(400).json({
        success:false,
        message:"All fields are required",
      })
    }
    //find profile
    const userDetails=await User.findById(id);
    const profileId=userDetails.additionalDetails;
    const profileDetails=await Profile.findById(profileId);
    console.log(profileDetails);
    //update profile
    profileDetails.dateOfBirth=dateOfBirth;
    profileDetails.about=about;
    profileDetails.gender=gender;
    profileDetails.contactNumber=contactNumber;
    const updatedDetails=await profileDetails.save();
    //Todo H/W: populate and console log
    //return response
    return res.status(200).json({
      success:true,
      message:"Profile updated successfully",
      updatedDetails:updatedDetails,
    })
    }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"Couldnt update profile,please try again",
      error:err.message,
    })
  }
}



//deleteAccount


exports.deleteAccount=async(req,res)=>{
  try{
    //Get id 
    const id=req.user.id;
    //validation
    const userDetails=await User.findById(id);
    if(!userDetails){
      return res.status(404).json({
        success:false,
        message:"User not found",
      })
    }
    //Todo H/W: remove student from enrolled 
    //Delete Profile
    let profileId=userDetails.additionalDetails;
    await Profile.findByIdAndDelete({_id:profileId});
    //Delete User
    await User.findByIdAndDelete({_id:id});
    //return response
    return res.status(200).json({
      success:true,
      message:"Account deleted successfully"
    })
    //H/W how to schedule this operation
  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"Couldnt delete account,please try again",
      error:err.message,
    })
  }
}

//getAllDetails of User
exports.getAllUserDetails=async(req,res)=>{
  try{
    //get id
    const id = req.user.id;
    //validation and get user details
    const userDetails=await User.findById(id).populate("additionalDetails").exec();
    //return response
    return res.status(200).json({
      success:true,
      message:"User details fetched successfully",
      userDetails
    });

  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"Couldnt fetch details,please try again",
      error:err.message,
    })
  }
}


exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path:"courses",
        populate:{
          path:"courseContent",
          populate:{
            path:"subSection"
          }
        }
      })
      .exec()


      const userDetailsNew = userDetails.toObject()
	  var SubsectionLength = 0
	  for (var i = 0; i < userDetailsNew.courses.length; i++) {
		let totalDurationInSeconds = 0
		SubsectionLength = 0
		for (var j = 0; j < userDetailsNew.courses[i].courseContent.length; j++) {
		  totalDurationInSeconds += userDetailsNew.courses[i].courseContent[
			j
		  ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
		  userDetailsNew.courses[i].totalDuration = convertSecondsToDuration(
			totalDurationInSeconds
		  )
		  SubsectionLength +=
			userDetailsNew.courses[i].courseContent[j].subSection.length
		}
		let courseProgressCount = await CourseProgress.findOne({
		  courseID: userDetails.courses[i]._id,
		  userId: userId,
		})
		courseProgressCount = courseProgressCount?.completedVideos.length
		if (SubsectionLength === 0) {
		  userDetailsNew.courses[i].progressPercentage = 100
		} else {
		  // To make it up to 2 decimal point
		  const multiplier = Math.pow(10, 2)
		  userDetailsNew.courses[i].progressPercentage =
			Math.round(
			  (courseProgressCount / SubsectionLength) * 100 * multiplier
			) / multiplier
		}
	  }





    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetailsNew.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};


exports.instructorDashboard=async(req,res)=>{
  try{
    const courseDetails=await Course.find({
      instructor:req.user.id
    })
    const courseData=courseDetails?.map((course,index)=>{
      const totalStudentsEnrolled=course?.studentsEnrolled?.length;
      const totalAmountGenerated=totalStudentsEnrolled*course?.price;


      //create a new object with the additional fields
      const courseDataWithStats={
        _id:course?._id,
        courseName:course?.courseName,
        courseDescription:course?.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,

      }

      return courseDataWithStats;
  })

    return res.status(200).json({
      success:true,
      courses:courseData
    })
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      success:false,
      message:"Internal Server error"
    })
  }
}