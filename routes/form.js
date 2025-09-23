const express= require('express');
const router = express.Router();

const catchAsync  = require('../utils/catchAsync');

const formController = require('../controllers/form');

router.get('/', formController.userInput);

router.post('/get-analysis', catchAsync(formController.input));

module.exports = router;