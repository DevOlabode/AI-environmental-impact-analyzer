const Product = require('../models/product');

module.exports.getDashboard = async (req, res) => {
    const products = await Product.find({ owner: req.user._id });
    res.render('dashboard', { products });
};

module.exports.getImpact = async (req, res) => {
    try {
        const productCount = await Product.countDocuments({ owner: req.user._id });
        const noProducts = productCount === 0;

        let totalCO2OverTime = [];
        let categoryBreakdown = [];
        let monthlyComparison = [];
        let top10Worst = [];

        if (!noProducts) {
            // Total CO2 footprint over time (daily)
            totalCO2OverTime = await Product.aggregate([
            { $match: { owner: req.user._id, createdAt: { $exists: true, $type: "date" } } },
            { $lookup: { from: 'impacts', localField: 'impactAnalysis', foreignField: '_id', as: 'impact' } },
            { $unwind: '$impact' },
            { $match: { 'impact.carbonFootprint': { $exists: true, $ne: null } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, totalCO2: { $sum: '$impact.carbonFootprint' } } },
            { $sort: { '_id': 1 } }
        ]);

        // Category breakdown
        categoryBreakdown = await Product.aggregate([
            { $match: { owner: req.user._id } },
            { $lookup: { from: 'impacts', localField: 'impactAnalysis', foreignField: '_id', as: 'impact' } },
            { $unwind: '$impact' },
            { $match: { 'impact.carbonFootprint': { $exists: true, $ne: null } } },
            { $group: { _id: '$category', totalCO2: { $sum: '$impact.carbonFootprint' } } },
            { $sort: { totalCO2: -1 } }
        ]);

        // Monthly comparison
        monthlyComparison = await Product.aggregate([
            { $match: { owner: req.user._id, createdAt: { $exists: true, $type: "date" } } },
            { $lookup: { from: 'impacts', localField: 'impactAnalysis', foreignField: '_id', as: 'impact' } },
            { $unwind: '$impact' },
            { $match: { 'impact.carbonFootprint': { $exists: true, $ne: null } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, totalCO2: { $sum: '$impact.carbonFootprint' } } },
            { $sort: { '_id': 1 } }
        ]);

        // Top 10 worst products
        top10Worst = await Product.aggregate([
            { $match: { owner: req.user._id } },
            { $lookup: { from: 'impacts', localField: 'impactAnalysis', foreignField: '_id', as: 'impact' } },
            { $unwind: '$impact' },
            { $match: { 'impact.carbonFootprint': { $exists: true, $ne: null } } },
            { $sort: { 'impact.carbonFootprint': -1 } },
            { $limit: 10 },
            { $project: { name: 1, carbonFootprint: '$impact.carbonFootprint' } }
        ]);
        }

        res.render('dashboard/impact', {
            noProducts,
            totalCO2OverTime: totalCO2OverTime || [],
            categoryBreakdown: categoryBreakdown || [],
            monthlyComparison: monthlyComparison || [],
            top10Worst: top10Worst || []
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
