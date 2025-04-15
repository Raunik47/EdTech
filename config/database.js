const mongoose= require('mongoose');
require('dotenv').config();

exports.connectDatabase= ()=>{

    mongoose.connect(process.env.MONGODB_URL)
    .then( () =>{ console.log("succesfully connected with database") })
    .catch((error) => {
        console.log("error in connecting");
        console.error(error);
        process.exit(1)
    })

}
