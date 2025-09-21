const mongoose = require('mongoose');
const { Schema } = mongoose;
const passprtLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String,
        unique : true,
        required : true
    }
});

userSchema.plugin(passprtLocalMongoose);

module.exports = mongoose.model('User', userSchema);