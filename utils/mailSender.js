const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    // 1. Create a transporter using your email service credentials
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,

      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // 2. Define and send the email
    const info = await transporter.sendMail({
      from: `"StudyNotion | CodeHelp" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = mailSender;
