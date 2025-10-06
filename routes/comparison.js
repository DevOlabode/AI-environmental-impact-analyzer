const express = require('express');
const router = express.Router();

const Product = require('../models/product');

const comparison = require('../controllers/comparison');

const { isLoggedIn } = require('../middleware');

router.get('/compare', isLoggedIn, comparison.productToCompare);

module.exports = router;