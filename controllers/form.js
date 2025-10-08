const Products = require('../models/product');
const Impact = require('../models/impact');

const {analyseImpact } = require('../utils/AI')

module.exports.userInput = (req, res) => {
    res.render('form/input')
};

module.exports.input = async (req, res) => {
    const formData = req.body;
    const impactAnalysis = await analyseImpact(
        formData.name,
        formData.brand,
        formData.category,
        formData.material,
        formData.weight,
        formData.originCountry,
        formData.price
    );

    const impact = new Impact(impactAnalysis);
    await impact.save();

    if (req.user) {
        const product = new Products({
            ...req.body,
            owner: req.user._id,
            impactAnalysis: impact._id
        });

        await product.save()
        return res.render('form/show', { product })
    } else {
        const product = {
            ...req.body,
            impactAnalysis,
            createdAt: new Date()
        };
        return res.render('form/show', { product })
    }
}

module.exports.allProducts = async (req, res) => {
    const { search, category, brand } = req.query;
    const filter = { owner: req.user._id };

    // Search by name, brand, or category (case-insensitive)
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { brand: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } }
        ];
    }

    // Filter by category
    if (category && category.trim() !== '') {
        filter.category = { $regex: category, $options: 'i' };
    }

    // Filter by brand
    if (brand && brand.trim() !== '') {
        filter.brand = { $regex: brand, $options: 'i' };
    }

    const products = await Products.find(filter).populate('impactAnalysis');
    res.render('form/index', { products, search, category, brand });
};



module.exports.showProducts = async (req, res) => {
    const product = await Products.findById(req.params.id).populate('impactAnalysis');
    if (!product || product.owner.toString() !== req.user._id.toString()) {
        req.flash('error', 'Product not found or access denied');
        return res.redirect('/form/all-products');
    }
    res.render('form/show', { product })
}

module.exports.editInputForm = async(req, res)=>{
    const product = await Products.findById(req.params.id);
    res.render('form/edit', { product })
};

module.exports.editInput = async (req, res) => {
    const product = await Products.findById(req.params.id);

    if (!product) {
        req.flash('error', 'Product Not Found!');
        return res.redirect('/form/all-products');
    }

    // Check if user owns the product
    if (product.owner && product.owner.toString() !== req.user._id.toString()) {
        req.flash('error', 'You do not have permission to edit this product');
        return res.redirect('/form/all-products');
    }

    try {
        const formData = req.body;
        const impactAnalysisData = await analyseImpact(
            formData.name,
            formData.brand,
            formData.category,
            formData.material,
            formData.weight,
            formData.originCountry,
            formData.price
        );

        const impact = new Impact(impactAnalysisData);
        await impact.save();

        const updatedProduct = await Products.findByIdAndUpdate(req.params.id,
            {
                ...req.body,
                impactAnalysis: impact._id
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

    const product = await Products.findById(id);
    if(!product) {
        req.flash('error', 'Product Not Found');
        return res.redirect('/form/all-products');
    }

    if(product.owner.toString() !== req.user._id.toString()) {
        req.flash('error', 'You do not have permission to delete this product');
        return res.redirect('/form/all-products');
    }

    await Products.findByIdAndDelete(id);
    res.redirect('/form/all-products');
}
