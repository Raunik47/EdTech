// Import the Required modules
const express = require("express");
const router = express.Router();

// Import The Controllers
// Course Controllers Import
const {
    createCourse,
    showAllCourses,
    getAllCourseDetails
} = require("../controllers/Course");

// Categories Controllers Import
const {
    showAllCategory,  // Changed from showAllCategories to match controller export
    createCategory,
    categoryPageDetails,  // Changed from CategoryPageDetails to match controller export
} = require("../controllers/Category");

// Section Controllers Import
const {
    CreateSection,
    UpdateSection,
    deleteSection 
} = require("../controllers/Section");

// Sub Section Controllers Import
const {
    subSectionCreate,
    updateSubSection,
    subSectionDelete 
} = require("../controllers/SubSection");

// Rating Controllers Import 
const {
    createRating,
    getAveragerating,
    getAllRatingAndReview 
} = require("../controllers/RatingAndReview");

// Auth MiddleWare Import
const {
    auth,
    isStudent,
    isInstructor,
    isAdmin 
} = require("../middlewares/auth");

console.log("ShowAllCategory:", showAllCategory);
console.log("CreateCategory:", createCategory);
console.log("CategoryPageDetails:", categoryPageDetails);

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************
router.post("/createCourse", auth, isInstructor, createCourse);

//Add a Section to a Course
router.post("/addSection", auth, isInstructor, CreateSection);

// Update a Section
router.post("/updateSection", auth, isInstructor, UpdateSection);

// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);

// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);

// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, subSectionDelete);

// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, subSectionCreate);

// Get all Registered Courses
router.get("/getAllCourses", showAllCourses);

// Get Details for a Specific Courses
router.post("/getCourseDetails", getAllCourseDetails);

// ******************************************************
//                Category routes (Only by Admin)
// ******************************************************
// Category can Only be Created by Admin
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategory);  // Changed to match the controller function name
router.post("/getCategoryPageDetails", categoryPageDetails);  // Changed to match the controller function name

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAveragerating);
router.get("/getReviews", getAllRatingAndReview);

module.exports = router;