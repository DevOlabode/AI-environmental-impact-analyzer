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
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
});

module.exports = mongoose.model('Goal', goalSchema);