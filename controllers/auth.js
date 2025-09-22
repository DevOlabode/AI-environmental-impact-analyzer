const User = require('../models/user');


module.exports.registerForm = (req, res)=>{
    res.render('auth/register')
};

module.exports.register = async(req, res)=>{
    const { username, email, password} = req.body
    const user = new User({ username, email});
    const registeredUser = await User.register(user, password);

    
    req.login(registeredUser, err => {
        if(err) return next(err)
    })
    req.flash('success', 'Welcome The AI Environmental Impact AnaLyser');
    res.redirect('/')
};