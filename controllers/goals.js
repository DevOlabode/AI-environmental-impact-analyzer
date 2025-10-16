const Product = require('../models/product');
const Goal = require('../models/goals');
const { calculateDaysRemaining, calculateProgress, getStatusBadgeClass, getStatusText } = require('../utils/goalUtils');

module.exports.allGoals = async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });

  const goalsWithProgress = await Promise.all(
    goals.map(async (goal) => {
      const products = await Product.find({
        owner: req.user._id,
        createdAt: {
          $gte: goal.startDate,
          $lte: goal.endDate,
        },
      }).populate('impactAnalysis');

      const totalCO2 = products.reduce(
        (sum, product) => sum + (product.impactAnalysis?.carbonFootprint || 0),
        0
      );

    const remaining = Math.max(0, goal.reductionTarget - totalCO2);
    let progress = Math.round((remaining / goal.reductionTarget) * 100);
    progress = Math.max(0, Math.min(progress, 100));

      const now = new Date();
      const timeframeEnded = now > goal.endDate;
      const goalReached = totalCO2 <= goal.reductionTarget && timeframeEnded;

      // Calculate days remaining using utility function
      const daysInfo = calculateDaysRemaining(goal.endDate);

      return {
        ...goal.toObject(),
        totalCO2,
        progress,
        timeframeEnded,
        goalReached,
        daysRemaining: daysInfo.daysRemaining,
        isExpired: daysInfo.isExpired,
        isEndingToday: daysInfo.isEndingToday,
        isActive: daysInfo.isActive,
        statusBadgeClass: getStatusBadgeClass(daysInfo.isExpired, daysInfo.isEndingToday, goalReached),
        statusText: getStatusText(daysInfo.isExpired, daysInfo.isEndingToday, goalReached)
      };

    })
  );

  res.render('goals/allGoals', { goals: goalsWithProgress });
};

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

  if (!goal || goal.user.toString() !== req.user._id.toString()) {
    req.flash('error', 'Unauthorised Action');
    return res.redirect('/goals');
  }

  const products = await Product.find({
    owner: req.user._id,
    createdAt: {
      $gte: goal.startDate,
      $lte: goal.endDate,
    },
  }).populate('impactAnalysis');

  const totalCO2 = products.reduce(
    (sum, product) => sum + (product.impactAnalysis?.carbonFootprint || 0),
    0
  );

    const remaining = Math.max(0, goal.reductionTarget - totalCO2);
    let progress = Math.round((remaining / goal.reductionTarget) * 100);
    progress = Math.max(0, Math.min(progress, 100));

  const now = new Date();
  const timeframeEnded = now > goal.endDate;
  const goalReached = totalCO2 <= goal.reductionTarget && timeframeEnded;

  // Calculate days remaining using utility function
  const daysInfo = calculateDaysRemaining(goal.endDate);

  res.render('goals/show', {
    goal,
    totalCO2,
    progress,
    timeframeEnded,
    goalReached,
    daysRemaining: daysInfo.daysRemaining,
    isExpired: daysInfo.isExpired,
    isEndingToday: daysInfo.isEndingToday,
    isActive: daysInfo.isActive,
    statusBadgeClass: getStatusBadgeClass(daysInfo.isExpired, daysInfo.isEndingToday, goalReached),
    statusText: getStatusText(daysInfo.isExpired, daysInfo.isEndingToday, goalReached)
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