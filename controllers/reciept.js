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
        const buffer = Buffer.from(base64Data, 'base64');

        const analysis = await analyseReceipt(base64Data); // or pass buffer if your function expects it
        
        console.log('Analysis Result:', analysis);

        res.json({
            success: true,
            products: analysis,
            message: 'Receipt processed successfully'
        });

    } catch (error) {
        console.error('Error analyzing receipt:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to analyze receipt' 
        });
    }
};