const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');

router.get('/impact', dashboardController.getImpact);

module.exports = router;
