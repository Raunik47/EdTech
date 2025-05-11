const crypto = require("crypto");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const {instance}=require("../config/razorpayinstance");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");



// Function to capture payment and create a Razorpay order
exports.capturePayment = async (req, res) => {
  const { course_id } = req.body;
  const userId = req.user.id;

  // Validate course ID
  if (!course_id) {
    return res.json({
      success: false,
      message: "Please provide valid course ID",
    });
  }

  let course;
  try {
    // Fetch course details
    course = await Course.findById(course_id);
    if (!course) {
      return res.json({
        success: false,
        message: "Could not find the course",
      });
    }

    // Check if user already enrolled in the course
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.StudentEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "User already enrolled in this course",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  // Create Razorpay order
  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100, // amount in paise
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };

  try {
    // initiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);

    // Send order details to frontend  
    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Could not initiate order",
    });
  }
};

// Function to verify payment signature sent by Razorpay webhook
exports.verifySignature = async (req, res) => {
  const webhookSecret = "12345678"; // This must match with Razorpay dashboard webhook secret

  const signature = req.headers["x-razorpay-signature"];

  // Create HMAC digest from raw body
  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  // Match the signature with digest
  if (signature === digest) {
    console.log(" Payment is Authorised");

    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      // Add user to course's enrolled students list
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not Found",
        });
      }

      // Send confirmation email to student
      const enrolledStudent = await User.findById(userId);
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations from StudyNotion",
        "Congratulations, you have successfully enrolled in a new StudyNotion course!"
      );

      console.log("📧 Email Response:", emailResponse);

      return res.status(200).json({
        success: true,
        message: "Signature Verified and Course Added",
      });
    } catch (error) {
      console.log(" Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    // Invalid signature: possible spoof attempt
    return res.status(400).json({
      success: false,
      message: "Invalid Signature",
    });
  }
};
