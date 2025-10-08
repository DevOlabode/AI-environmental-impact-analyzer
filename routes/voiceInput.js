const express = require('express');
const router = express.Router();

const voiceInputController = require('../controllers/voiceInput');
const { isLoggedIn } = require('../middleware');

router.get('/', isLoggedIn, voiceInputController.voiceInputEJS);
router.get('/ai', isLoggedIn, voiceInputController.voiceInputAI);
router.post('/ai/process', isLoggedIn, voiceInputController.processVoiceInput);

module.exports = router;
