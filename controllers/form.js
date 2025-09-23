const Form = require('../models/form');

module.exports.userInput = (req, res)=>{
    res.render('form/input')
};

module.exports.input = async(req, res)=>{
    const userInfo = req.body;
    const product = new Form(req.body);
}