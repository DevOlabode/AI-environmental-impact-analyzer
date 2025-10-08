const Product = require('../models/product');
const User = require('../models/user');
const { voiceInput } = require('../utils/AI');
const catchAsync = require('../utils/catchAsync');

module.exports.voiceInputEJS = (req, res) =>{
    res.render('voiceInput/voiceInput');
};

module.exports.voiceInputAI = (req, res) =>{
    res.render('voiceInput/voiceInputAI');
};

module.exports.processVoiceInput = catchAsync(async (req, res) => {
    const { transcript } = req.body;
    if (!transcript) {
        return res.status(400).json({ error: 'Transcript is required' });
    }
    const productData = await voiceInput(transcript);
    console.log(productData);
    res.send({ productData });
});
