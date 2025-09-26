const path = require('path');
const Product = require('../models/product');
const { analyseReceipt, analyseImpact } = require('../utils/formAI');

const fs = require('fs');
const Tesseract = require('tesseract.js');

module.exports.getReciept = (req, res)=>{
    res.render('reciept/getReciept')
};

module.exports.analyseReciept = async (req, res) => {
    try {
        const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '');
        const products = await analyseReceipt(base64Data);

        let createdProducts = [];
        for (const product of products) {
            const impactAnalysis = await analyseImpact(
                product.name,
                product.brand,
                product.category,
                product.material,
                product.weight,
                product.originCountry,
                product.price
            );

            const newProduct = new Product({
                name: product.name,
                brand: product.brand,
                category: product.category,
                material: product.material,
                weight: product.weight,
                originCountry: product.originCountry,
                price: product.price,
                owner: req.user._id,
                impactAnalysis: impactAnalysis,
            });

            await newProduct.save();
            createdProducts.push(newProduct);
        }

        res.json({
            success: true,
            message: 'Receipt processed successfully!',
            products: createdProducts.length,
            redirect: '/form/all-products'
        });
    } catch (error) {
        console.error('Error processing receipt:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process receipt. Please try again.'
        });
    }
};
