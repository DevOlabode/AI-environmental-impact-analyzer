const express = require('express');
const router = express.Router();

const recieptController = require('../controllers/reciept');
const catchAsync = require('../utils/catchAsync');

const upload = require('../utils/multer'); 

router.get('/get-reciept', recieptController.getReciept);

router.post('/analyseReciept', catchAsync(recieptController.analyseReciept));

module.exports = router;