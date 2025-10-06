const Product = require('../models/product');

module.exports.productToCompare =  async(req, res) => {
    const products = await Product.find({ owner: req.user._id });
    res.render('comparison/compare', {products});
};