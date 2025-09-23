const Form = require('../models/form');

const {analyseImpact } = require('../utils/formAI')

module.exports.userInput = (req, res)=>{
    res.render('form/input')
};

module.exports.input = async(req, res)=>{
    const formData = req.body;
    const impactAnalysis = await analyseImpact(formData);
    console.log(impactAnalysis)
    const product = new Form({
        ...req.body,
        owner : req.user._id ? req.user : null,
        impactAnalysis
    });

    if(req.user){
        await product.save()
    }

    res.render('form/show', { product })
}