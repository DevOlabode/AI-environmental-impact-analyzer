const express = require('express');
const router = express.Router();
const Products = require('../models/product');

const catchAsync  = require('../utils/catchAsync'); 
const { isLoggedIn } = require('../middleware')
const userController = require('../controllers/user');

router.get('/profile', isLoggedIn, catchAsync(userController.profile));

router.post('/edit-profile', isLoggedIn, catchAsync(userController.editProfileForm));

module.exports = router;