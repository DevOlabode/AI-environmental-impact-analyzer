const express = require('express');
const router = express.Router();
const footerLinks = require('../controllers/footerLinks');

router.get('/about', footerLinks.about);
router.get('/help-center', footerLinks.helpCenter);
router.get('/contact-us', footerLinks.contactUs);
router.get('/privacy-policy', footerLinks.privacyPolicy);
router.get('/terms-of-service', footerLinks.termsOfService);

module.exports = router;
