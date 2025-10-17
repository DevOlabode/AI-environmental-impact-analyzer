const express = require('express');
const router = express.Router();
const contactUsController = require('../controllers/contactUs');

router.post('/', contactUsController.handleContactForm);

module.exports = router;