const Product = require('../models/product');
const Goal = require('../models/goals');


module.exports.setGoal =  (req, res) => {
    res.render('goals/setGoals');
};

module.exports.saveGoal = async (req, res) => {
    const { title, notes, reductionTarget, timeframe } = req.body;

    // Calculate end date based on timeframe
    
}
