// routes/barcode.js
const express = require('express');
const router = express.Router();

const {isLoggedIn} = require('../middleware');

const barcodeController = require('../controllers/barcode');
const catchAsync = require('../utils/catchAsync');

// Get barcode scanner page
router.get('/scan-barcode', catchAsync(barcodeController.getBarcodeScanner));

// Look up product by barcode
router.post('/lookup-barcode', catchAsync(barcodeController.lookupBarcode));

// Save scanned product
router.post('/save-scanned-product', catchAsync(barcodeController.saveScannedProduct));

module.exports = router;