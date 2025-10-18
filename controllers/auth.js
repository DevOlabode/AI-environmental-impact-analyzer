const User = require('../models/user');
const Product = require('../models/product');
const Goal = require('../models/goals');
const Impact = require('../models/impact');


const { sendPasswordResetCode } = require('../utils/emailService');


module.exports.registerForm = (req, res)=>{
    res.render('auth/register')
};

module.exports.register = async(req, res)=>{
    const { username, email, password, lastName, firstName, bio, location} = req.body
    const user = new User({ username, email, lastName, firstName, bio, location});
    const registeredUser = await User.register(user, password);
    
    req.login(registeredUser, err => {
        if(err) return next(err)
        req.flash('success', 'Welcome The AI Environmental Impact Analyser');
        res.redirect('/')
    })
};

module.exports.loginForm = (req, res)=>{
    res.render('auth/login')
};

module.exports.login = (req, res)=>{
    req.flash('success', 'Welcome Back To The Environmental Impact Analyzer');
    const redirectUrl = res.locals.returnTo || '/'
    res.redirect(redirectUrl);
};

module.exports.logout = async(req, res)=>{
    req.logout(err=>{
        if(err) return next(err);
        req.flash('success', "Successfully Signed Out");
        res.redirect('/')
    })
};

module.exports.deleteAccount = async(req, res)=>{
    const userId = req.user._id;

    await Product.deleteMany({ owner : userId });
    await Goal.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    req.flash('success', 'Your account and all associated data have been deleted.');
    res.redirect('/');
};

const generateResetCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

module.exports.sendResetCode = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const resetCode = generateResetCode();
        const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        user.resetCode = resetCode;
        user.resetCodeExpires = resetCodeExpires;
        await user.save();

        const emailResult = await sendPasswordResetCode(user.email, resetCode);
        if (!emailResult.success) {
            return res.status(500).json({ success: false, message: 'Failed to send email' });
        }

        res.json({ success: true, message: 'Reset code sent to your email' });
    } catch (error) {
        console.error('Error sending reset code:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// module.exports.resetPassword = async (req, res) => {
// };

module.exports.updatePassword = async (req, res) => {
    const user = await User.findById(req.user._id);
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if(newPassword !== confirmPassword) {
        req.flash('error', 'New password and confirmation do not match');
        return res.redirect('/profile');
    }

    if(!user){
        req.flash('error', 'User not found');
        return res.redirect('/profile');
    }

     // ✅ check if current password is correct
    const { user: authenticatedUser, error } = await user.authenticate(currentPassword);
    
    if (error || !authenticatedUser) {
        req.flash('error', 'Current password is incorrect');
        return res.redirect(`/profile`);
    }

    await user.setPassword(newPassword);
    await user.save();

    req.flash('success', 'Password changed successfully');
    res.redirect('/profile');
}