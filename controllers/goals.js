const Product = require('../models/product');
const Goal = require('../models/goals');

module.exports.allGoals = async(req, res)=>{
    const goals = await Goal.find({user : req.user._id});
    res.render('goals/allGoals', {goals});
}

module.exports.setGoal =  (req, res) => {
    res.render('goals/setGoals');
};

module.exports.saveGoal = async (req, res) => {
    const { title, notes, reductionTarget, timeframe, startDate } = req.body;

    // Calculate end date based on timeframe
        const start = startDate ? new Date(startDate) : new Date();

        // Calculate end date based on timeframe
        let endDate = new Date(start);
        switch (timeframe) {
            case 'Weekly':
                endDate.setDate(start.getDate() + 7);
                break;
            case 'Monthly':
                endDate.setMonth(start.getMonth() + 1);
                break;
            case 'Quarterly':
                endDate.setMonth(start.getMonth() + 3);
                break;
            case 'Yearly':
                endDate.setFullYear(start.getFullYear() + 1);
                break;
            default:
                endDate.setMonth(start.getMonth() + 1);
        }

        const goal = new Goal({
            user: req.user._id,
            title,
            notes,
            reductionTarget,
            timeframe,
            startDate: start,
            endDate
        })

        await goal.save();

        req.flash('success', 'Goal set successfully!');
        res.redirect('/goals');
}
