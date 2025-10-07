const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');

const {isLoggedIn} = require('../middleware')

router.get('/impact', isLoggedIn, dashboardController.getImpact);

module.exports = router;
