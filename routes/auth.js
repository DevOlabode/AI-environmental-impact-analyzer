const express = require('express');
const router = express.Router();

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const authController = require('../controllers/auth')

router.get('/register', authController.registerForm)

module.exports = router;