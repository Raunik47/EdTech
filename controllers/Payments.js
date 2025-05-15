const {instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
const mongoose=require("mongoose"); 
const crypto=require("crypto");
const {paymentSuccessEmail} =require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");
//Capture payment and intitate razorpay order->create order for multiple items buy
exports.capturePayment=async(req,res)=>{
  
  const {courses}=req.body;
  const userId=req.user.id;

  if(courses.length===0){
    return res.json({
      success:false, 
      message:"Please provide Course Id"
    });
  }
  
  let totalAmount=0;
  console.log(courses);
  for(const course_id of Object.values(courses)){
    let course;
    try{
      course=await Course.findById(course_id);
      if(!course){
        return res.status(404).json({
          success:false,
          message:"Could not find the course"
        });
      }
      const uid=new mongoose.Types.ObjectId(userId);
      if(course.studentsEnrolled.includes(uid)){
        return res.status(200).json({success:false,message:"Student is already enrolled"})
      }
      totalAmount+=course.price;
    }
    catch(error){
      console.log(error);
      return res.status(500).json({
        success:false,
        message:error.message
      })
    }
  }
  
  //Creating options to create order
  const options={
    amount:totalAmount*100,
    currency:"INR",
    receipt:Math.random(Date.now()).toString(),
  }


  try{
    const paymentResponse = await instance.orders.create(options);
    return res.json({
      success:true,
      data:paymentResponse
    })
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Could not Intitate Order"
    })
  }
}


//verify the payment 
exports.verifySignature=async(req,res)=>{
  const razorpay_order_id=req.body?.razorpay_order_id;
  const razorpay_payment_id=req.body?.razorpay_payment_id;
  const razorpay_signature=req.body?.razorpay_signature;
  const courses=req.body?.courses;
  const userId=req.user.id;

  if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
    return res.status(404).json({
      success:false,
      message:"Payment failed",
    })
  }

  let body=razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");
  if(expectedSignature===razorpay_signature){
    //enroll the student

    await enrollStudents(courses,userId,res);
    //return response
    return res.status(200).json({
      success:true,
      message:"Payment Verified",
    })
  }  

  return res.status(200).json({
    success:false,
    message:"Payment Failed"
  })
}

const enrollStudents=async(courses,userId,res)=>{

  //first append user id in all courses
  //then append course id in user's courses
  if(!courses || !userId){
    return res.status(400).json({
      success:false,
      message:"Please Provide data for Courses"
    })
  }

  for(const courseId of Object.values(courses)){
        try{
             const enrolledCourse=await Course.findOneAndUpdate({_id:courseId},{
      $push:{
        studentsEnrolled:userId
      }
    },{
      new:true
    });

    if(!enrolledCourse){
      return res.status(500).json({
        success:false,
        message:"Course Not Found"
      })
    }


    const courseProgress=await CourseProgress.create({
      courseID:courseId,
      userId:userId,
      completedVideos:[],
    })



    // find the student and add the course to their list of courses
  const enrolledStudent=await User.findByIdAndUpdate(userId,{
    $push:{
      courses:courseId,
      courseProgress:courseProgress._id,      
    }
  },{new:true});

  //Send mail to the  student

  const emailResponse=await mailSender(
    enrolledStudent.email,
    `Successfully enrolled into ${enrolledCourse.courseName}`,
    courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName}`)
  );

  console.log("Email Sent Successfully",emailResponse.response);


        }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:error.message,
    })
  }

  }

}

//for sending the mail
exports.sendPaymentSuccessEmail=async(req,res)=>{
  const {orderId,paymentId,amount}=req.body;
  const userId=req.user.id;

  if(!orderId || !paymentId || !amount || !userId){
    return res.status(400).json({
      success:false,
      message:"Please provide all the fields"
    })
  } //find student data with the userId

  try{
    const enrolledStudent=await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(`${enrolledStudent.firstName}`,amount/100,orderId,paymentId)

    )
  }

  catch(error){
    console.log("error in sending mail",error);
    return res.status(500).json({
      success:false,
      message:"Could not send email"
    })
  }

}