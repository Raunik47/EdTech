const SubSection = require("../models/SubSection");
const Section = require("../models/Section");

const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
  try {
    // fetch data from req body
    const { sectionId, title, timeDuration, decription } = req.body;

    // extract file/Video
    const video = req.files.videoFile;
    // validate data
    if (!sectionId || !title || !timeDuration || !decription) {
      return res.status(400).json({
        succes: false,
        message: "All fields are required",
      });
    }

    // uplaod video to the cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // create a sub-section
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    // update section with this sub section Object
    const updateSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: SubSectionDetails._id,
        },
      },
      { new: true }
    );
    // log updated section here ,after adding populate query

    // return response
    return res.status(200).json({
      succes: true,
      message: "sub section created Succesfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      succes: false,
      message: "Internal server Error",
      error: error.message,
    });
  }
};

// hw:update SubSection
// delete Subsection