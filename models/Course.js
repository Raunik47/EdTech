const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  courseDescription: {
    type: String,
    required: true,
  },
  instructor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  WhatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
    required:true,
  },
  thumbnail: {
    type: String,
  },
  tag: {
    type:mongoose.Schema.Types.ObjectId ,
    ref :"Tag",
  },
  StudentEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports=mongoose.model("Course", courseSchema);