const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(401).json({
        success: false,
        message: "All fields should be filled",
      });
    }

    const categoryDetail = await Category.create({ name, description });
    console.log(categoryDetail);

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.showAllCategory = async (req, res) => {
  try {
    const allCategories = await Category.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All categories returned successfully",
      allCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Missing categoryId",
      });
    }

    const selectedCategory = await Category.findById(categoryId).populate("courses").exec();

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    }).populate("courses");

    let differentCourses = [];
    for (const category of categoriesExceptSelected) {
      differentCourses.push(...category.courses);
    }

    // Get all courses to find top-selling
    const allCategories = await Category.find({}).populate("courses");

    let allCourses = [];
    for (const category of allCategories) {
      allCourses.push(...category.courses);
    }

    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      selectedCourses: selectedCategory.courses,
      differentCourses,
      mostSellingCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
