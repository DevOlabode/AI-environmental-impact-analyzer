const User = require('../models/user');

module.exports.profile = async(req, res)=>{
    const user = await User.findById(req.user._id);

    if(!user){
        req.flash('error', 'User not found');
        return res.redirect('/');
    }

    res.render('auth/profile', {user})
};

module.exports.editProfileForm = async (req, res) => {
    const { password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/');
    }

    user.authenticate(password, (err, authenticatedUser, message) => {
        if (authenticatedUser) {
            res.send("✅ Password is correct");
        } else {
            res.send("❌ Incorrect password");
        }
    });
};
