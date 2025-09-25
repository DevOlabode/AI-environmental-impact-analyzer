const path = require('path');
const Product = require('../models/product');
const { analyseReceipt, analyseImpact } = require('../utils/formAI');

const fs = require('fs');
const Tesseract = require('tesseract.js');

module.exports.getReciept = (req, res)=>{
    res.render('reciept/getReciept')
};

// --- Step 1: OCR helper ---
async function extractTextFromImage(filePath) {
  const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
  return text;
}

// --- Step 2: Basic product parser (stub for now) ---
function parseProductsFromText(text) {
  // Example: split lines & filter only item-like entries
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Naive parsing → later improve with AI or regex
  return lines.map(line => {
    // Example: "NIKE RUN SHOES 79.99"
    const parts = line.split(' ');
    const price = parseFloat(parts.pop()); // last word is price
    const name = parts.join(' ');

    return {
      name,
      price,
      brand: null,  
      category: null,
      material: null,
      weight: null,
      originCountry: null
    };
  });
}

// --- Step 3: Controller ---
// module.exports.uploadReciept = async (req, res) => {
//   try {
//     const { image } = req.body;
//     if (!image) throw new Error('No image provided');

//     // Save image to disk
//     const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
//     const filename = `uploads/receipts/${Date.now()}.png`;
//     fs.writeFileSync(filename, Buffer.from(base64Data, 'base64'));

//     // OCR the receipt
//     const text = await extractTextFromImage(filename);
//     console.log('OCR text:', text);

//     // Parse products from text
//     const products = parseProductsFromText(text);

//     const savedProducts = [];
//     for (const prod of products) {
//       const impactAnalysis = await analyseImpact(
//         prod.name,
//         prod.brand,
//         prod.category,
//         prod.material,
//         prod.weight,
//         prod.originCountry
//       );

//       const product = new Product({
//         name: prod.name,
//         brand: prod.brand,
//         category: prod.category,
//         material: prod.material,
//         weight: prod.weight,
//         originCountry: prod.originCountry,
//         owner: req.user ? req.user._id : null,
//         impactAnalysis,
//         receipt: filename
//       });

//       await product.save();
//       savedProducts.push(product._id);
//     }

//     res.json({
//       success: true,
//       path: filename,
//       products: savedProducts,
//       message: `${savedProducts.length} product(s) analyzed and saved.`
//     });
//   } catch (error) {
//     console.error('Error analyzing receipt:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
module.exports.uploadReciept = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) throw new Error('No image provided');

    // Save image to disk
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const filename = `uploads/receipts/${Date.now()}.png`;
    fs.writeFileSync(filename, Buffer.from(base64Data, 'base64'));

    // Instead of manual OCR + naive parsing, use Groq Vision to extract fields
    const aiProducts = await analyseReceipt(base64Data); 
    console.log("AI Products:", aiProducts);

    const savedProducts = [];
    for (const prod of aiProducts) {
      // Run environmental impact analysis using AI
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
      savedProducts.push(product);
    }

    res.json({
      success: true,
      path: filename,
      products: savedProducts,
      message: `${savedProducts.length} product(s) analyzed and saved.`
    });
  } catch (error) {
    console.error('Error analyzing receipt:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};