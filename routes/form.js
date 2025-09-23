const express= require('express');
const router = express.Router();

const catchAsync  = require('../utils/catchAsync');

const { isLoggedIn } = require('../middleware')

const formController = require('../controllers/form');

router.get('/', formController.userInput);

router.post('/get-analysis', catchAsync(formController.input));

router.get('/all-products', isLoggedIn, catchAsync(formController.allProducts));

router.get('/show-products', isLoggedIn, catchAsync(formController.showProducts))

router.get('/edit-input/:id', isLoggedIn, catchAsync(formController.editInputForm));

module.exports = router;