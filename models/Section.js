const mongoose = require("mongoose");
const SubSection = require("./SubSection");
const Course= require("../models/Course")

const sectionSchema = new mongoose.Schema({
  sectionName: 
    {
      type: String,
    },
  
   subSection:
    {
      type: mongoose.Schema.Types.ObjectId, 
      required:true,
      ref:"SubSection"
    },


    // ye wali maine khud se ki hai

    course: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Course"
}
   
});

module.exports = mongoose.model("Section",  sectionSchema );
