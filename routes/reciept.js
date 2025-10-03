const express = require('express');
const router = express.Router();

const recieptController = require('../controllers/reciept');
const catchAsync = require('../utils/catchAsync');

const {isLoggedIn} = require('../middleware');
const {validateProduct } = require('../middleware');

const upload = require('../utils/multer'); 

router.get('/get-reciept', isLoggedIn, recieptController.getReciept);

router.post('/analyseReciept', upload.single('reciept'), validateProduct , isLoggedIn, catchAsync(recieptController.analyseReciept));

module.exports = router;