const express = require('express');
const router = express.Router();

const { loginAuthenticate, storeReturnTo, isLoggedIn, redirectIfLoggedIn } = require('../middleware')

const catchAsync = require('../utils/catchAsync');
const authController = require('../controllers/auth');

router.get('/register', authController.registerForm);

router.post('/register', catchAsync(authController.register));

router.get('/login', redirectIfLoggedIn, authController.loginForm);

router.post('/login', storeReturnTo, loginAuthenticate, authController.login);

router.get('/logout', catchAsync(authController.logout));

router.delete('/delete-account', isLoggedIn, catchAsync(authController.deleteAccount));

router.post('/send-reset-code', isLoggedIn, catchAsync(authController.sendResetCode));

router.post('/reset-password', isLoggedIn, catchAsync(authController.resetPassword));

router.post('/update-password', isLoggedIn, catchAsync(authController.updatePassword)); 

module.exports = router;
