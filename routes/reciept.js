const express = require('express');
const router = express.Router();

const recieptController = require('../controllers/reciept');
const catchAsync = require('../utils/catchAsync')

router.get('/get-reciept', recieptController.getReciept);

router.post('/upload-reciept', catchAsync(recieptController.uploadReciept));

module.exports = router;