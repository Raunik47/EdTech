const Tag = require("../models/Category");

exports.createcategory = async (req, res) => {
  try {
    // fetch name and description for tag from the body that is provided by the client side
    // These field names must exactly match the schema defined in your Tag model

    const { name, description } = req.body;

    // validation  that no any field shd be empty while creating tags
    if (!name || !description) {
      return res.status(401).json({
        success: false,
        message: "All the field shoud by filled ",
      });
    }

    // create entry in db
    const categoryDetail = await Tag.create({
      name: name,
      description: description,
    });
    console.log(categoryDetail);

    return res.status(200).json({
      success: true,
      message: "Tags created succesfully ",
    });
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.showAllcategory = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All tags returned succesfully",
      allTags,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
