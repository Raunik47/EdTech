const mongoose=require('mongoose')

const profileSchema=new mongoose.Schema({
    gender:{
    type:String,
    required:true,
    },
    dob :{
        type:String,
        required:true,
    },
    about: {
type: String,
required:true,
    },

    number: {
        type:Number,
        required:true,
        trim: true
    }

})   
module.profileSchema=mongoose.new('Profile',profileSchema); 