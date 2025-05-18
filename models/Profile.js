const mongoose=require('mongoose')

const profileSchema = new mongoose.Schema({
  gender:    { type: String, required: false },
  dateofBirth:       { type: String, required: false },
  about:     { type: String, required: false },
  number:    { type: Number, required: false },
});

module.exports=mongoose.model('Profile',profileSchema); 

