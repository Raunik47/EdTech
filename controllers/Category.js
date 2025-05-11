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

// category page details handler function


exports.categoryPageDetails = async (req, res) => {
try {
// Get categoryId from request body
const { categoryId } = req.body;

// Validate presence of categoryId
if (!categoryId) {
  return res.status(400).json({
    success: false,
    message: "Missing categoryId",
  });
}

// Fetch selected category and its courses
const selectedCategory = await Category.findById(categoryId)
  .populate("courses")
  .exec();

// Validate selected category
if (!selectedCategory) {
  return res.status(404).json({
    success: false,
    message: "Category not found",
  });
}

// Fetch courses from other categories (excluding selected category)
const categoriesExceptSelected = await Category.find({
  _id: { $ne: categoryId },
}).populate("courses");

// Collect all courses from other categories
let differentCourses = [];
for (const category of categoriesExceptSelected) {
  differentCourses.push(...category.courses);
}



// Get top 10 selling courses across all categories
const mostSellingCourses = allCourses
  .sort((a, b) => b.sold - a.sold)
  .slice(0, 10);

// Return final response
return res.status(200).json({
  success: true,
  selectedCourses: selectedCategory.courses,
  differentCourses: differentCourses,
  mostSellingCourses: mostSellingCourses,
});
} catch (error) {
return res.status(500).json({
success: false,
message: "Internal server error",
error: error.message,
});
}
};