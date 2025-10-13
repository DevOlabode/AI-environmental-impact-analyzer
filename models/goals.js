const mongoose = require('mongoose');
const { Schema } = mongoose;

const goalSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    notes : {
        type : String,
        required : false,
        default : ''
    },
    reductionTarget :{
        type : Number,  //in KG
        required : true
    },
    timeframe : {
        type : String,
        enum : ['Weekly', 'Monthly', 'Yearly', "Quarterly"],
        required : true,
        default : 'Monthly'
    },
    startDate : {
        type : Date,
        required : true,
        default : Date.now
    },
    endDate : {
        type : Date,
        required : true
    }
});

module.exports = mongoose.model('Goal', goalSchema);


/* 
Hello the web app is well done and could be improved. At some point when I tried analyzing a second product 
2) The product analysis section should save users past entry for logging users 
4) capture receipt shows a 'Upload failed: Failed to process receipt. Please try again.' on snapped image 
5) Logging users on clicking 'about us' below the application gets navigated to the current user page which is the current analysis form page, I was thinking it would be a dedicated about us page. 
So here are some feedbacks I got from using the web app but well done
*/