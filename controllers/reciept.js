const fs = require('fs');
const path = require('path');
const Product = require('../models/product');
const { analyseReceipt, analyseImpact } = require('../utils/formAI');

module.exports.getReciept = (req, res)=>{
    res.render('reciept/getReciept')
};


module.exports.uploadReciept = async(req, res)=>{
    const { image } = req.body; // Base64 data
    if (!image) {
        return res.status(400).json({ success: false, message: 'No image provided' });
    }

    // Remove the prefix "data:image/png;base64,"
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Ensure directory exists
    const dir = 'uploads/receipts';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Save to disk
    const filename = path.join(dir, `${Date.now()}.png`);
    fs.writeFileSync(filename, buffer);

    try {
        // Analyze receipt with AI
        const products = await analyseReceipt(base64Data);

        if (products.length === 0) {
            return res.json({ success: true, path: filename, message: 'Receipt saved, but no products detected.' });
        }

        // For each product, analyze impact and save
        const savedProducts = [];
        for (const prod of products) {
            const impactAnalysis = await analyseImpact(
                prod.name,
                prod.brand,
                prod.category,
                prod.material,
                prod.weight,
                prod.originCountry
            );

            const product = new Product({
                name: prod.name,
                brand: prod.brand,
                category: prod.category,
                material: prod.material,
                weight: prod.weight,
                originCountry: prod.originCountry,
                owner: req.user ? req.user._id : null,
                impactAnalysis,
                receipt: filename
            });

            await product.save();
            savedProducts.push(product._id);
        }

        res.json({ success: true, path: filename, products: savedProducts, message: `${savedProducts.length} product(s) analyzed and saved.` });
    } catch (error) {
        console.error('Error analyzing receipt:', error);
        res.status(500).json({ success: false, message: 'Receipt saved, but analysis failed: ' + error.message });
    }
}
