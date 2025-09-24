const express = require('express');
const router = express.Router();

const recieptController = require('../controllers/reciept');
const catchAsync = require('../utils/catchAsync')

router.get('/getReciept', recieptController.getReciept);

router.post('/uploadReciept', catchAsync(recieptController.uploadReciept));

module.exports = router