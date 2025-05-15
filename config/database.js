const mongoose = require('mongoose');
require('dotenv').config();

exports.connectDatabase = () => {
  mongoose.connect(process.env.MONGODB_URL) 
  .then(() => console.log(" Successfully connected to the database"))
  .catch((error) => {
    console.error(" Database connection error:", error.message);
    process.exit(1); // Exit with failure
  });
};
