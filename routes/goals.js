const express = require('express');
const router = express.Router();

const goalsController = require('../controllers/goals');

router.get('/set-goals', goalsController.setGoal);

module.exports = router;