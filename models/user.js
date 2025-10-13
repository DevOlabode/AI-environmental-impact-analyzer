const mongoose = require('mongoose');
const { Schema } = mongoose;
const passprtLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String,
        unique : true,
        required : true
    },
    firstName :{
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    bio : {
        type : String,
        required : false,
        default : ''
    },
    location : {
        city : {
            type : String,
            default : ''
        },
        country : {
            type : String,
            default : ''
        }
    },
    resetCode: {
        type: String,
        default: null
    },
    resetCodeExpires: {
        type: Date,
        default: null
    },

    //CO2 Reduction Goal Setting Schema 
    
    goal : {
        type : String,
        required : false,
        default : null,
        completed : {
            type : Boolean,
            default : false
        }
    },
    completedGoals : {
        type : [String],
        default : []
    }
});

userSchema.plugin(passprtLocalMongoose);

module.exports = mongoose.model('User', userSchema);