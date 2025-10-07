const express = require('express');
const router = express.Router();

const voiceInputController = require('../controllers/voiceInput');

router.get('/', voiceInputController.voiceInputEJS);
router.get('/ai', voiceInputController.voiceInputAI);
router.post('/ai/process', voiceInputController.processVoiceInput);

module.exports = router;
