const Product = require('../models/product');
const Goal = require('../models/goals');

module.exports.allGoals = async(req, res)=>{
    const goals = await Goal.find({user : req.user._id});

    // Calculate progress for each goal
    const goalsWithProgress = await Promise.all(goals.map(async (goal) => {
        const products = await Product.find({
            owner: req.user._id,
            createdAt: {
                $gte: goal.startDate,
                $lte: goal.endDate
            }
        }).populate('impactAnalysis');

        const totalCO2 = products.reduce((sum, product) => {
            return sum + (product.impactAnalysis?.carbonFootprint || 0);
        }, 0);

        let progress = Math.max(0, Math.min(((goal.reductionTarget - totalCO2) / goal.reductionTarget) * 100, 100));
        progress = Math.round(progress);

        const now = new Date();
        const timeframeEnded = now > goal.endDate;
        const goalReached = progress >= 100;

        return {
            ...goal.toObject(),
            totalCO2,
            progress,
            timeframeEnded,
            goalReached
        };
    }));

    res.render('goals/allGoals', {goals: goalsWithProgress});
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

    const products = await Product.find({
        owner : req.user._id,
        createdAt: {
            $gte: goal.startDate,
            $lte: goal.endDate
        }
    }).populate('impactAnalysis');

  const totalCO2 = products.reduce((sum, product) => {
    return sum + (product.impactAnalysis?.carbonFootprint || 0);
  }, 0);

  let progress = Math.max(0, Math.min(((goal.reductionTarget - totalCO2) / goal.reductionTarget) * 100, 100));
  progress = Math.round(progress);

  const now = new Date();
  const timeframeEnded = now > goal.endDate;
  const goalReached = progress >= 100;

  res.render('goals/show', {
    goal,
    totalCO2,
    progress,
    timeframeEnded,
    goalReached
  });
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