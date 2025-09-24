const Product = require('../models/product');

module.exports.getReciept = (req, res)=>{
    res.render('reciept/getReciept')
};

module.exports.uploadReciept = async(req, res)=>{
    const { image } = req.body; // Base64 data
    if (!image) throw new Error('No image provided');

    // Remove the prefix "data:image/png;base64,"
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Save to disk
    const filename = `uploads/receipts/${Date.now()}.png`;
    require('fs').writeFileSync(filename, buffer);

    // Save path to MongoDB
    const product = new Product({
      ...req.body,        // your other form data
      owner: req.user ? req.user._id : null,
      receipt: filename
    });

    await product.save();
    res.json({ success: true, path: filename });
}