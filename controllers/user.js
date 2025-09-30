const User = require('../models/user');

module.exports.profile = async(req, res)=>{
    const user = await User.findById(req.user._id);

    if(!user){
        req.flash('error', 'User not found');
        return res.redirect('/');
    }

    res.render('auth/profile', {user})
};
