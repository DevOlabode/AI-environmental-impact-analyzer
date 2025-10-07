const express = require('express');
const router = express.Router();

const voiceInputController = require('../controllers/voiceInput');

router.get('/', voiceInputController.voiceInputEJS);

module.exports = router;
