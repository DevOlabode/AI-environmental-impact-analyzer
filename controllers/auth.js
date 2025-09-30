const User = require('../models/user');


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

//Reminderer : 
// Ensure To Update The Registration And Profile Update Logic Accordingly
