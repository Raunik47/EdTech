
const mongoose = require("mongoose");
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




// Get Average Rating for a Course
exports.getAverageRating = async (req, res) => {
    try {
        // 1. Get course ID from request body
        const courseId = req.body.courseId;

        // 2. Validate course ID
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }

        // 3. Calculate average rating using MongoDB aggregation
        const result = await RatingAndReview.aggregate([
            {
                // Stage 1: Match reviews for this specific course
                $match: {
                    course: new mongoose.Types.ObjectId(courseId), // Corrected from Types_ObjectId
                },
            },
            {
                // Stage 2: Group all matching reviews to calculate average
                $group: {
                    _id: null, // Group all documents together
                    averageRating: { $avg: "$rating" }, // Calculate average of 'rating' field
                },
            },
        ]);

        // 4. Return the result
        if (result.length > 0) {
            return res.status(200).json({
                success: true, // Corrected from 'successful'
                averageRating: result[0].averageRating,
            });
        }

        // 5. If no ratings exist for this course
        return res.status(200).json({
            success: true,
            message: "Average Rating is 0, no ratings given yet",
            averageRating: 0,
        });

    } catch (error) {
        console.error("Error calculating average rating:", error);
        return res.status(500).json({
            success: false, // Corrected from 'successful'
            message: "Failed to calculate average rating",
            error: error.message,
        });
    }
};


// Get all ratings and reviews with sorting and population
exports.getAllRatingAndReviews = async (req, res) => {
    try {
        // Fetch all reviews with sorting and population
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })  // Sort by rating in descending order
            .populate({
                path: "user",
                select: "firstName lastName email image",  // Only include these user fields
            })
            .populate({
                path: "course",
                select: "courseName",  // Only include course name
            })
            .exec();  // Execute the query

        // Return successful response with all reviews
        return res.status(200).json({
            success: true,  // Corrected from 'successortrue'
            message: "All reviews fetched successfully",
            data: allReviews,
        });

    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
            error: error.message,
        });
    }
};