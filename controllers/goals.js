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
    const { title, notes, reductionTarget, timeframe, startDate, endDate: userEndDate } = req.body;

    // Use provided startDate or today
    const start = startDate ? new Date(startDate) : new Date();

    let endDate;

    if (userEndDate) {
        // ✅ If user provides an end date, use it
        endDate = new Date(userEndDate);
    } else {
        // ✅ Otherwise, calculate it based on timeframe
        endDate = new Date(start);
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
    }

    const goal = new Goal({
        user: req.user._id,
        title,
        notes,
        reductionTarget,
        timeframe,
        startDate: start,
        endDate
    });

    await goal.save();
    req.flash('success', 'Goal set successfully!');
    res.redirect('/goals');
};

module.exports.show = async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if(!goal || goal.user.toString() !== req.user._id.toString()){
        req.flash('error', "Unauthorised Action");
        return res.redirect('/goals'); 
    };

    res.render('goals/show', { goal});
};

module.exports.editGoalForm = async(req, res) =>{
    const goal = await Goal.findById(req.params.id);

    if(!goal || goal.user.toString() !== req.user._id.toString()){
        req.flash('error', "Unauthorised Action");
        return res.redirect('/goals'); 
    }
    res.render('goals/editGoal', {goal});
};

module.exports.updateGoal = async (req, res) => {
    const { id } = req.params;
    const { title, notes, reductionTarget, timeframe, startDate, endDate: userEndDate } = req.body;

    // Use provided startDate or today
    const start = startDate ? new Date(startDate) : new Date();

    let endDate;

    if (userEndDate) {
        // ✅ If the user provides an endDate, use it
        endDate = new Date(userEndDate);
    } else {
        // ✅ Otherwise, calculate it based on timeframe
        endDate = new Date(start);
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
    }

    // ✅ Update goal data
    await Goal.findByIdAndUpdate(id, {
        title,
        notes,
        reductionTarget,
        timeframe,
        startDate: start,
        endDate
    });

    req.flash('success', 'Goal updated successfully!');
    res.redirect('/goals');
};


module.exports.deleteGoal = async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if(!goal || goal.user.toString() !== req.user._id.toString()){
        req.flash('error', "Unauthorised Action");
        return res.redirect('/goals'); 
    }

    const deleted = await Goal.findByIdAndDelete(req.params.id);
    req.flash('success', `The ${deleted.title} goal has deleted successfully`);
    res.redirect('/goals');
};