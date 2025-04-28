const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../");

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.head("Authorisation").replace("Bearer", "");

    // if token missing thren return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // verify the token using seceret key

    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      // verification issue
      // if verification issue occur then
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (error) {
    // if verification issue occur then
    return res.status(401).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// isStudent middleware
exports.isStudent = async (req, res) => {
  try {
    // acces the role from request or by 2nd method  by using account type  from the db
    if (req.user.accountType !== "Student") {
      // if account type not matched with student then return the respons issue occur then
      return res.status(401).json({
        success: false,
        message: "this is not the protected route for the Student only",
      });
    }
    next();
  } catch (error) {
    // if verification issue occur then
    return res.status(500).json({
      success: false,
      message: "User role cannot be varified,plase try again",
    });
  }
};

// 
// isInstuctor middleware
exports.isInstructor = async (req, res) => {
    try {
      // acces the role from request or by 2nd method  by using account type  from the db
      if (req.user.accountType !== "Instructor") {
        // if account type not matched with student then return the respons issue occur then
        return res.status(401).json({
          success: false,
          message: "this is not the protected route for the Instructor only",
        });
      }
      next();
    } catch (error) {
      // if verification issue occur then
      return res.status(500).json({
        success: false,
        message: "User role cannot be varified,plase try again",
      });
    }
  };

//   isAdmin
// isStudent middleware
exports.isAdmin = async (req, res) => {
    try {
      // acces the role from request or by 2nd method  by using account type  from the db
      if (req.user.accountType !== "Admin") {
        // if account type not matched with student then return the respons issue occur then
        return res.status(401).json({
          success: false,
          message: "this is not the protected route for the admin only",
        });
      }
      next();
    } catch (error) {
      // if verification issue occur then
      return res.status(500).json({
        success: false,
        message: "User role cannot be varified,plase try again",
      });
    }
  };