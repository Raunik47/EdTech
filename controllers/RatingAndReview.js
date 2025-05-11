const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

// Create a new rating and review
exports.createRating = async (req, res) => {
  try {
    // STEP 1: Extract user ID from auth middleware
    const userId = req.user.id;

    // STEP 2: Extract data from request body
    const { rating, review, courseId } = req.body;

    // STEP 3: Validate enrollment — ensure user is enrolled in the course
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }

    // STEP 4: Check if user has already reviewed this course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }

    // STEP 5: Create new rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // STEP 6: Update course with this rating/review ID
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { ratingAndReviews: ratingReview._id },
      },
      { new: true } // return updated document
    );

    // STEP 7: Return success response
    return res.status(200).json({
      success: true,
      message: "Rating and Review created successfully",
      data: ratingReview,
    });

  } catch (error) {
    console.error("Error creating rating and review:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create rating and review",
      error: error.message,
    });
  }
};
