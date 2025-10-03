const express= require('express');
const router = express.Router();

const catchAsync  = require('../utils/catchAsync');

const { isLoggedIn } = require('../middleware');

const { validateProduct } = require('../middleware');

const formController = require('../controllers/form');

router.get('/', formController.userInput);

router.post('/get-analysis', validateProduct, catchAsync(formController.input));

router.get('/all-products', isLoggedIn, catchAsync(formController.allProducts));

router.get('/show-products/:id', validateProduct, isLoggedIn, catchAsync(formController.showProducts));

router.get('/edit/:id', isLoggedIn, catchAsync(formController.editInputForm));

router.put('/edit-products/:id', validateProduct, isLoggedIn, catchAsync(formController.editInput));

router.delete('/delete-product/:id', validateProduct, isLoggedIn, catchAsync(formController.deleteProduct))

module.exports = router;