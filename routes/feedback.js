const express = require('express');
const router = express.Router();

const feedbackController = require('../controllers/feedback');
const { isLoggedIn } = require('../middleware');

router.post('/', isLoggedIn, feedbackController.sendFeedback);

module.exports = router;