// controllers/receiptBarcode.js
const Product = require('../models/product');
const { analyseImpact } = require('../utils/AI');
const axios = require('axios');

// Fetch product data from barcode
const fetchProductFromBarcode = async (barcode) => {
    try {
        const offResponse = await axios.get(
            `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );
        
        if (offResponse.data.status === 1) {
            const product = offResponse.data.product;
            return {
                name: product.product_name || 'Unknown Product',
                brand: product.brands || 'Unknown Brand',
                category: product.categories_tags?.[0]?.replace('en:', '') || 'Food',
                material: product.packaging || 'Mixed',
                weight: product.quantity || '0',
                originCountry: product.countries || 'Unknown',
                price: 0,
                barcode: barcode,
                imageUrl: product.image_url || null
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching product from barcode:', error);
        return null;
    }
};

module.exports.getReceiptBarcodeScanner = (req, res) => {
    res.render('barcode/receiptScanner');
};

// module.exports.processReceiptBarcodes = async (req, res) => {
//     try {
//         const { barcodes } = req.body;
        
//         if (!barcodes || !Array.isArray(barcodes) || barcodes.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'No barcodes detected in the receipt'
//             });
//         }

//         // Remove duplicates
//         const uniqueBarcodes = [...new Set(barcodes)];
        
//         let foundProducts = [];
//         let notFoundBarcodes = [];
        
//         // Fetch product data for each barcode
//         for (const barcode of uniqueBarcodes) {
//             const productData = await fetchProductFromBarcode(barcode);
            
//             if (productData) {
//                 foundProducts.push(productData);
//             } else {
//                 notFoundBarcodes.push(barcode);
//             }
//         }

//         if (foundProducts.length === 0) {
//             return res.json({
//                 success: false,
//                 message: 'No products found for the detected barcodes',
//                 notFoundBarcodes: notFoundBarcodes
//             });
//         }

//         res.json({
//             success: true,
//             products: foundProducts,
//             notFoundBarcodes: notFoundBarcodes,
//             totalDetected: uniqueBarcodes.length,
//             totalFound: foundProducts.length
//         });

//     } catch (error) {
//         console.error('Error processing receipt barcodes:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error processing barcodes'
//         });
//     }
// };

// module.exports.saveBarcodeProducts = async (req, res) => {
//     try {
//         const { products } = req.body;

//         if (!products || !Array.isArray(products)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid product data'
//             });
//         }

//         let savedProducts = [];

//         for (const productData of products) {
//             // Get AI impact analysis
//             const impactAnalysis = await analyseImpact(
//                 productData.name,
//                 productData.brand,
//                 productData.category,
//                 productData.material,
//                 productData.weight,
//                 productData.originCountry,
//                 productData.price
//             );

//             const newProduct = new Product({
//                 ...productData,
//                 owner: req.user._id,
//                 impactAnalysis: impactAnalysis
//             });

//             await newProduct.save();
//             savedProducts.push(newProduct);
//         }

//         req.flash('success', `Successfully saved ${savedProducts.length} products from receipt!`);
//         res.json({
//             success: true,
//             message: `${savedProducts.length} products saved successfully`,
//             redirect: '/form/all-products'
//         });

//     } catch (error) {
//         console.error('Error saving products:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error saving products: ' + error.message
//         });
//     }
// };