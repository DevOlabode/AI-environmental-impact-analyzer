const Product = require('../models/product');
const User = require('../models/user');

module.exports.voiceInputEJS = (req, res) =>{
    res.render('voiceInput/voiceInput');
};