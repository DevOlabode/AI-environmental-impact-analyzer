// routes/receiptBarcode.js
const express = require('express');
const router = express.Router();

const receiptBarcodeController = require('../controllers/receiptBarcode');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

// Get receipt barcode scanner page
router.get('/scan-receipt-barcodes', isLoggedIn, receiptBarcodeController.getReceiptBarcodeScanner);

// Process barcodes from receipt
router.post('/process-receipt-barcodes', isLoggedIn, catchAsync(receiptBarcodeController.processReceiptBarcodes));

// Save products from barcodes
router.post('/save-barcode-products', isLoggedIn, catchAsync(receiptBarcodeController.saveBarcodeProducts));

module.exports = router;