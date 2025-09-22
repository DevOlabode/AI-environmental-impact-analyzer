const express = require('express');
const router = express.Router();

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const authController = require('../controllers/auth')

router.get('/register', authController.registerForm);

router.post('/register', catchAsync(authController.register));

router.get('/login', authController.loginForm)

module.exports = router;