const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    // Get input data from request body
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    // Get user ID from decoded JWT (middleware sets req.user)
    const id = req.user.id;

    // Basic validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find user and extract profile ID
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;

    // Find profile document
    const profileDetails = await Profile.findById(profileId);

    // Update profile fields
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      profileDetails,
    });
  } catch (error) {
    // Handle server error
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete user account controller
exports.deleteAccount = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const id = req.user.id;

    // Validate user exists
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user's profile (additional details)
    await Profile.findByIdAndDelete({
      _id: userDetails.additionalDetails, // Changed from 'id' to '_id' as that's the MongoDB convention
    });

    // TODO: Unenroll user from all enrolled courses
    // This would require additional implementation

    // Delete user account
    await User.findByIdAndDelete({
      _id: id, // Changed from 'id' to '_id'
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error deleting user account:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user account",
      error: error.message,
    });
  }
};

// get all userDetails
exports.getUserDetails = async (req, res) => {
  try {
    // Get user ID from the authenticated request
    const id = req.user.id;

    // Find user by ID and populate additional details (like profile information)
    // The populate() method automatically replaces the specified path with documents from other collections
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec(); 
      // exec() executes the query

    // Check if user exists
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return successful response with user data
    return res.status(200).json({
      success: true,
      message: "User Data Fetched Successfully",
      data: userDetails, // Include the actual user details in the response
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
