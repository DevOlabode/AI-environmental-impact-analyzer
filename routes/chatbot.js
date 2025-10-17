const express = require('express');
const router = express.Router();
const { getChatbotResponse } = require('../controllers/chatbot');

router.post('/response', getChatbotResponse);

module.exports = router;
