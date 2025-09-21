const User = require('../models/user');


module.exports.registerForm = (req, res)=>{
    res.render('auth/register')
};