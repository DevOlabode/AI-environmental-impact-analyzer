const path = require('path');
const Product = require('../models/product');
const Impact = require('../models/impact');
const { analyseReceipt } = require('../AI/analyseReciept');
const analyseImpact = require('../AI/analyseImpact');

const fs = require('fs');
const Tesseract = require('tesseract.js');

module.exports.getReciept = (req, res) => {
    res.render('reciept/getReciept')
};

module.exports.analyseReciept = async (req, res) => {
    try {
        if (!req.body.image) {
            return res.status(400).json({
                success: false,
                error: 'No image provided. Please capture a photo of your receipt.'
            });
        }
        const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '');
        const products = await analyseReceipt(base64Data);

        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No products detected. Please upload a clear image of a receipt.'
            });
        }

        let createdProducts = [];
        for (const product of products) {
            const impactAnalysisData = await analyseImpact(
                product.name,
                product.brand,
                product.category,
                product.material,
                product.weight,
                product.originCountry,
                product.price
            );

            const impact = new Impact(impactAnalysisData);
            await impact.save();

            const newProduct = new Product({
                name: product.name,
                brand: product.brand,
                category: product.category,
                material: product.material,
                weight: product.weight,
                originCountry: product.originCountry,
                price: product.price,
                owner: req.user._id,
                impactAnalysis: impact._id,
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
        res.status(500).json({
            success: false,
            error: 'Failed to process receipt. Please try again.'
        });
    }
};
