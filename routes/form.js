const express= require('express');
const router = express.Router();

const catchAsync  = require('../utils/catchAsync');

const { isLoggedIn } = require('../middleware');

const { validateProduct, validateProductInput } = require('../middleware');

const formController = require('../controllers/form');

router.get('/', formController.userInput);

router.post('/get-analysis', validateProductInput, catchAsync(formController.input));

router.get('/all-products', isLoggedIn, catchAsync(formController.allProducts));

router.get('/show-products/:id', isLoggedIn, catchAsync(formController.showProducts));

router.get('/edit/:id', isLoggedIn, catchAsync(formController.editInputForm));

router.put('/edit-products/:id', validateProductInput, isLoggedIn, catchAsync(formController.editInput));

router.delete('/delete-product/:id', isLoggedIn, catchAsync(formController.deleteProduct))

router.post('/toggle-favorite/:id', isLoggedIn, catchAsync(formController.toggleFavorite))

router.get('/favorites', isLoggedIn, catchAsync(formController.getFavorites))

router.delete('/bulk-delete-products', isLoggedIn, catchAsync(formController.bulkDeleteProducts))

module.exports = router;
