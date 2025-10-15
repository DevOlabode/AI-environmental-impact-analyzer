const User = require('../models/User');

module.exports.profile = async(req, res)=>{
    const user = await User.findById(req.user._id);

    if(!user){
        req.flash('error', 'User not found');
        return res.redirect('/');
    }

    res.render('user/profile', {user})
};

module.exports.editProfileForm = async (req, res) => {
    const { password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/profile');
    }

    user.authenticate(password, (err, authenticatedUser, message) => {
        if (authenticatedUser) {
            res.render('user/edit', { user });
        } else {
            req.flash("error", "❌ Incorrect password")
            res.redirect('/profile');
        }
    });
};

module.exports.updateProfile = async(req, res)=>{
    const updatedProfile = req.body;
    const user = await User.findById(req.user._id);

    if(!user){
        req.flash('error', 'User not found');
        return res.redirect('/profile');
    }

    user.firstName = updatedProfile.firstName;
    user.lastName = updatedProfile.lastName;
    user.email = updatedProfile.email;
    user.location.city = updatedProfile.location.city;
    user.location.country = updatedProfile.location.country;
    user.bio = updatedProfile.bio;

    await user.save();

    req.flash('success', 'Profile updated successfully');
    res.redirect('/profile');
}