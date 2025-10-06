// controllers/barcode.js
const Product = require('../models/product');
const { analyseImpact } = require('../utils/AI');
const axios = require('axios');

// Fetch product data from Open Food Facts API
const fetchProductFromBarcode = async (barcode) => {
    try {
        // Try Open Food Facts first
        const offResponse = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        
        if (offResponse.data.status === 1) {
            const product = offResponse.data.product;
            return {
                name: product.product_name || 'Unknown Product',
                brand: product.brands || 'Unknown Brand',
                category: product.categories_tags?.[0]?.replace('en:', '') || 'General',
                material: product.packaging || 'Mixed',
                weight: product.quantity || '0',
                originCountry: product.countries || 'Unknown',
                price: 0, // User needs to input
                barcode: barcode,
                imageUrl: product.image_url || null
            };
        }

        // If not found, try UPCitemdb (requires free API key)
        // const upcResponse = await axios.get(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`);
        // Handle UPCitemdb response...

        return null;
    } catch (error) {
        console.error('Error fetching product from barcode:', error);
        return null;
    }
};

module.exports.getBarcodeScanner = (req, res) => {
    res.render('barcode/scanner');
};

module.exports.lookupBarcode = async (req, res) => {
    try {
        const { barcode } = req.body;

        if (!barcode) {
            return res.status(400).json({
                success: false,
                message: 'No barcode provided'
            });
        }

        // Check if product already exists in user's collection
        if (req.user) {
            const existingProduct = await Product.findOne({
                owner: req.user._id,
                barcode: barcode
            });

            if (existingProduct) {
                return res.json({
                    success: true,
                    exists: true,
                    product: existingProduct,
                    message: 'Product already in your collection'
                });
            }
        }

        // Fetch product data from external API
        const productData = await fetchProductFromBarcode(barcode);

        if (!productData) {
            return res.status(404).json({
                success: false,
                message: 'Product not found. You can add it manually.',
                barcode: barcode
            });
        }

        // Ensure no further code runs after sending response
        return res.json({
            success: true,
            exists: false,
            product: productData
        });

    } catch (error) {
        console.error('Error looking up barcode:', error);
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Error processing barcode'
            });
        }
    }
};

module.exports.saveScannedProduct = async (req, res) => {
    try {
        const formData = req.body;

        // Get impact analysis from AI
        const impactAnalysis = await analyseImpact(
            formData.name,
            formData.brand,
            formData.category,
            formData.material,
            formData.weight,
            formData.originCountry,
            formData.price
        );

        if (req.user) {
            const product = new Product({
                ...formData,
                owner: req.user._id,
                impactAnalysis
            });

            await product.save();
            
            req.flash('success', 'Product scanned and saved successfully!');
            return res.json({
                success: true,
                redirect: `/form/show-products/${product._id}`
            });
        } else {
            // For non-logged in users, just show analysis
            const product = {
                ...formData,
                impactAnalysis,
                createdAt: new Date()
            };
            
            return res.json({
                success: true,
                product: product,
                redirect: '/form'
            });
        }
    } catch (error) {
        console.error('Error saving scanned product:', error);
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Error saving product: ' + error.message
            });
        }
    }
};
