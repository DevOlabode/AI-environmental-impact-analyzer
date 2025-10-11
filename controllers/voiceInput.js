const Product = require('../models/product');
const User = require('../models/user');
const { voiceInput } = require('../AI/voiceInput');
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

    if(!productData){
        req.flash('error', 'Could not process the voice input. Please try again.');
        return res.redirect('/voiceInput/ai');
    }

    if(productData){
        return res.json( productData );
    }

    const product = new Product(productData);
    await product.save();

    const user = await User.findById(req.user._id);
    user.products.push(product);
    await user.save();

    req.flash('success', 'Product added successfully via voice input!');
    res.redirect(`/form/${product._id}`);
});
