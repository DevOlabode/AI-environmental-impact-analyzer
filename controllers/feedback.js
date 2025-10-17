// const { sendFeedback } = require('../utils/emailService');

// const User = require('../models/user'); 


// module.exports.sendFeedback = async(req, res)=>{
//     const user = await User.findById(req.user._id);

//     if(!user){
//         req.flash('error', 'User not found');
//         return res.redirect('/');
//     };

//     const { feedback } = req.body;

//     if(!feedback || feedback.trim().length === 0){
//         req.flash('error', 'Feedback cannot be empty');
//         return res.redirect('/');
//     }

//     const { email, username} = user;

//     const sendEmail = await sendFeedback(email, username, feedback);

//     if(!sendEmail.success){
//         req.flash('error', 'Failed to send feedback. Please try again later.');
//         return res.redirect('/profile');
//     }

//     req.flash('success', 'Feedback sent successfully. Thank you for helping us improve!');
//     const redirectUrl = res.locals.returnTo || '/';
//     res.redirect(redirectUrl);
// }

const { sendFeedback } = require('../utils/emailService');

const User = require('../models/user'); 


module.exports.sendFeedback = async(req, res)=>{
    const user = await User.findById(req.user._id);

    if(!user){
        req.flash('error', 'User not found');
        return res.redirect('/');
    };

    const { feedback } = req.body;

    if(!feedback || feedback.trim().length === 0){
        req.flash('error', 'Feedback cannot be empty');
        return res.redirect('/');
    }

    const { email, username} = user;

    const sendEmail = await sendFeedback(email, username, feedback);

    if(!sendEmail.success){
        req.flash('error', 'Failed to send feedback. Please try again later.');
        return res.redirect('/profile');
    }
    
    req.flash('success', 'Feedback sent successfully. Thank you for helping us improve!');
    const redirectUrl = res.locals.returnTo || '/';
    res.redirect(redirectUrl);
}