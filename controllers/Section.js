const Section = require("../models/Section");
const Course = require("../models/Course");

// create section
exports.createSection = async (req, res) => {
  try {
    // fetch  sectionName for creating entry n db according to this name  ,courseId is taken becoz by the help of it we can  update and add this section in that particular course
    // and as course is created to courseid will defintly  exist so when we click on create section the  id send in the req body
    const { sectionName, courseId } = req.body;

    // data validation
    if (!sectionName || !courseId) {
      return res.status(404).json({
        success: false,
        message: "Missing Properties",
      });
    }
    // create entry in db of new section
    const newSection = await Section.create({ sectionName });

    // update course with section ObjectID
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true } // This ensures the updated document is returned
    );
    // use populate to replace section /subsection both in the updatedCourseDetails

    // return response
    return res.status(200).json({
      success: true,
      message: "created succesfully ",
      updatedCourseDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create Section ,Please try Again",
      error: error.message,
    });
  }
};


                        // Update a section handler

exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionName, sectionId } = req.body;

    // data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
    // update data
    const sectionUpdate = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    // return res
    return res.status(500).json({
      success: true,
      message: "Section Update Succesfully",
      error: error.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update  Section ,Please try Again",
      error: error.message,
    });
  }
};

// Handler to delete a section
exports.deleteSection = async (req, res) => {
  try {
    //  Step 1: Extract section ID from URL parameters
    const { sectionId } = req.params;

    //  Step 2: Validate the sectionId
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Section ID is required",
      });
    }

    //  Step 3: Delete the section document from the database
    await Section.findByIdAndDelete(sectionId);

    // step 4:
    const courseId = section.course;

    // Step 5: Update the course and remove the deleted section's ID from courseContent
    
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    //  Step 5: Return a success response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    //  If any error occurs during deletion, send error response
    console.error("Error deleting section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting section",
    });
  }
};
