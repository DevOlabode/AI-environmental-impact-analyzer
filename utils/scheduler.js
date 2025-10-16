/**
 * Simple scheduler utility for background tasks
 */

const Goal = require('../models/goals');
const { calculateDaysRemaining } = require('./goalUtils');

/**
 * Update goal statuses based on current date
 * This function should be called daily to update goal statuses
 */
async function updateGoalStatuses() {
    try {
        console.log('Starting daily goal status update...');
        
        // Get all active goals (not expired)
        const activeGoals = await Goal.find({
            endDate: { $gte: new Date() }
        });

        let updatedCount = 0;

        for (const goal of activeGoals) {
            const daysInfo = calculateDaysRemaining(goal.endDate);
            
            // Check if goal status has changed
            if (daysInfo.isExpired || daysInfo.isEndingToday) {
                // Goal has expired or is ending today
                // We could add additional logic here to mark goals as expired
                // For now, the client-side JavaScript handles the real-time updates
                updatedCount++;
                console.log(`Goal "${goal.title}" status updated - Days remaining: ${daysInfo.daysRemaining}`);
            }
        }

        console.log(`Goal status update completed. ${updatedCount} goals updated.`);
        return { success: true, updatedCount };
        
    } catch (error) {
        console.error('Error updating goal statuses:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Schedule daily goal status updates
 * This function sets up the daily scheduler
 */
function startDailyScheduler() {
    // Calculate time until next midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Next midnight
    const timeUntilMidnight = midnight.getTime() - now.getTime();

    console.log(`Scheduler will start at midnight (${midnight.toLocaleString()})`);

    // Set timeout for first run at midnight
    setTimeout(() => {
        // Run immediately at midnight
        updateGoalStatuses();
        
        // Then run every 24 hours (86400000 ms)
        setInterval(updateGoalStatuses, 24 * 60 * 60 * 1000);
        
        console.log('Daily goal status scheduler started');
    }, timeUntilMidnight);
}

/**
 * Manual trigger for goal status update (useful for testing)
 */
async function triggerGoalStatusUpdate() {
    console.log('Manual goal status update triggered');
    return await updateGoalStatuses();
}

module.exports = {
    updateGoalStatuses,
    startDailyScheduler,
    triggerGoalStatusUpdate
};
