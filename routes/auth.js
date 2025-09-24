const express = require('express');
const router = express.Router();

const { loginAuthenticate, storeReturnTo } = require('../middleware')

const catchAsync = require('../utils/catchAsync');
const authController = require('../controllers/auth');

router.get('/register', authController.registerForm);

router.post('/register', catchAsync(authController.register));

router.get('/login', authController.loginForm);

router.post('/login', storeReturnTo, loginAuthenticate, authController.login);

router.get('/logout', catchAsync(authController.logout));

module.exports = router;