const passport = require('passport');
const { productSchema, productInputSchema } = require('./schema');

const ExpressError = require('./utils/ExpressError');



module.exports.validateProduct  = (req, res, next)=>{
    const { error } = productSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400)
    }else{
        next();
    }
};



module.exports.validateProductInput = (req, res, next)=>{
    const { error } = productInputSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400)
    }else{
        next();
    }
};

module.exports.loginAuthenticate = passport.authenticate('local', {
    failureFlash : true,
    failureRedirect : '/login'
});

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login')
    }
    next()
}

module.exports.storeReturnTo = (req, res, next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo
    }
    next();
};