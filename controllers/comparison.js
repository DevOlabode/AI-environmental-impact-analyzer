const Product = require('../models/product');

module.exports.productToCompare =  async(req, res) => {
    const products = await Product.find({ owner: req.user._id });
    res.render('comparison/compare', {products});
};

module.exports.compareProducts = async(req, res) => {
    const { product1, product2 } = req.body;
    console.log(product1, product2);
    res.send('Comparison feature coming soon!');
};