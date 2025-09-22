const passport = require('passport')

module.exports.loginAuthenticate = passport.authenticate('local', {
    failureFlash : true,
    failureRedirect : '/login'
});