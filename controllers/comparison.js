const Product = require('../models/product');
const { compareProducts } = require('../AI/compareProducts');

module.exports.productToCompare =  async(req, res) => {
    const products = await Product.find({ owner: req.user._id });
    res.render('comparison/compare', {products});
};

module.exports.compareProducts = async(req, res) => {
    const { product1, product2 } = req.body;
    const prod1 = await Product.findById(product1);
    const prod2 = await Product.findById(product2);

    const compare = await compareProducts(prod1, prod2);
    res.render('comparison/result', {compare});
};