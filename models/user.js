const mongoose = require('mongoose');
const { Schema } = mongoose;
const passprtLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
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
});

UserSchema.plugin(passprtLocalMongoose);

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
