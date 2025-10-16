const express = require('express');
const router = express.Router();
const footerLinks = require('../controllers/footerLinks');

router.get('/about', footerLinks.about);

module.exports = router;