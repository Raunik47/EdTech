const mongoose = require("mongoose");

const CourseProgress = new mongoose.Schema({
  courseId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }
  ],
  completeVideo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    }
  ],
});

module.exports = mongoose.model("CourseProgress", CourseProgress);
