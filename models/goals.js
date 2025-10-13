const mongoose = require('mongoose');
const { schema } = mongoose;

const goalSchema = new schema({
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
    timeFrame : {
        type : String,
        enum : ['Weekly', 'Monthly', 'Yearly', "Quarterly"],
        required : true,
        default : 'Monthly'
    }
});


/* 
Hello the web app is well done and could be improved. At some point when I tried analyzing a second product 
1) It was showing "Something went wrong 😕..",  and it was giving me raw unformatted string of answers to analyzed product in red color. 
2) The product analysis section should save users past entry for logging users 
3) The web app prompt users immediately for users to switch on camera on landing page and after logging in and I wasn't sure what it was doing. 
4) capture receipt shows a 'Upload failed: Failed to process receipt. Please try again.' on snapped image 
5) Logging users on clicking 'about us' below the application gets navigated to the current user page which is the current analysis form page, I was thinking it would be a dedicated about us page. 
So here are some feedbacks I got from using the web app but well done
*/