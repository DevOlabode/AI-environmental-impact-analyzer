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
    res.render('form/show', { product })
}

module.exports.editInputForm = async(req, res)=>{
    const product = await Form.findById(req.params.id);
    res.render('form/edit', { product })
};

module.exports.editInput = async(req, res)=>{
    const product = await Form.findById(req.params.id);

    if(!product) {
        req.flash('error', 'Product Not Found!');
        return res.redirect('/form/all-products');
    }

    // Check if user owns the product
    if(product.owner && product.owner.toString() !== req.user._id.toString()) {
        req.flash('error', 'You do not have permission to edit this product');
        return res.redirect('/form/all-products');
    }

    try {
        const impactAnalysis = await analyseImpact(req.body);

        const updatedProduct = await Form.findByIdAndUpdate(req.params.id,
            {
                ...req.body,
                impactAnalysis
            },
            {
                runValidators: true,
                new: true,
            }
        );

        req.flash('success', 'Product updated successfully');
        res.redirect(`/form/show-products/${updatedProduct._id}`);
    } catch (error) {
        req.flash('error', 'Error updating product: ' + error.message);
        res.redirect(`/form/edit/${req.params.id}`);
    }
};

module.exports.deleteProduct = async(req, res)=>{
    const {id} = req.params;

    const product = await Form.findByIdAndDelete(id);
    if(!product) return res.flash('error', 'Product Not Found');

    res.redirect('/form/all-products');
}