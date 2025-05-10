const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");

const { uploadImageToCloudinary } = require("../utils/imageUploader");

//  createCourse handler function

exports.createCourse = async (req, res) => {
  try {
    // fetch the data from req body
    const {
      courseName,
      courseDescription,
      instructor,
      whatYouWillLearn,
      price,
      tag,
    } = req.body;

    // get thumbnail
    const thumbnail = req.files.thumbnailImage;
    // perform validation
    if (
      !courseName ||
      !courseDescription ||
      !instructor ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // get  the user detail by using id  which we get from payload of token

    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Detail :", instructorDetails);

    // if instructor detail is not found then
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details not found",
      });
    }
    // check the tag given is valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag Details not found",
      });
    }

    // upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create entry in db
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // add the new course  to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );

    // update the Tag Schema same as user schema 

    await Tag.findByIdAndUpdate(
     { _id:tagDetails._id},
     {
      $push :{
        course: newCourse._id,
      }
     },
     {new:true}

    )
  
    // return response
    return res.status(200).json({
      success: true,
      message: "Course Created Succesfully",
      data: newCourse,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: "Failed tocreeate course",
      error: error.message,
    });
  }
};

// get all course data by using  handler function

exports.showAllCourses = async (req, res) => {
  try {
    // todo:change the below statemenent
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        StudentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all course fetched succesfully",
      data: allCourses,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: "Cannot fetch course data",
      error: error.message,
    });
  }
};
