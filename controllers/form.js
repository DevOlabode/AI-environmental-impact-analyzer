const Form = require('../models/form');

const {analyseImpact } = require('../utils/formAI')

module.exports.userInput = (req, res)=>{
    res.render('form/input')
};

module.exports.input = async(req, res)=>{
    const formData = req.body;
    const impactAnalysis = await analyseImpact(formData);

    const product = new Form({
        ...req.body,
        owner : req.user ? req.user._id : null,
        impactAnalysis
    });

    if(req.user){
        await product.save()
    }

    res.render('form/show', { product })
}

module.exports.allProducts = async(req, res)=>{
    const products = await Form.find();
    res.render('form/index', { products })
};

module.exports.showProducts = async (req, res) => {
    const product = await Form.findById(req.params.id);
    res.render('form/show', product)
}

module.exports.editInputForm = async(req, res)=>{
    const product = await Form.findById(req.params.id);
    res.render('form/edit', { product })
};