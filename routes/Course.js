// Import the Required modules
const express = require("express");
const router = express.Router();

// Import The Controllers
// Course Controllers Import
const {
    createCourse,
    showAllCourses,
    getAllCourseDetails,
} = require("../controllers/Course");

// Categories Controllers Import
const {
    showAllCategory,
    createCategory,
    categoryPageDetails,
} = require("../controllers/Category");

// Section Controllers Import
const {
    createSection,
    updateSection,
    deleteSection ,
} = require("../controllers/Section");

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");

// Rating Controllers Import 
const {
    createRating,
    getAverageRating,
    getAllRatingAndReviews 
} = require("../controllers/RatingAndReview");

// Auth MiddleWare Import
const {
    auth,
    isStudent,
    isInstructor,
    isAdmin 
} = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************
router.post("/createCourse", auth, isInstructor, createCourse);

// Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);

// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);

// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);

// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);

// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);

// Get all Registered Courses
router.get("/getAllCourses", showAllCourses);

// Get Details for a Specific Course
router.post("/getCourseDetails", getAllCourseDetails);

// ******************************************************
//                Category routes (Only by Admin)
// ******************************************************
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingAndReviews);

module.exports = router;
