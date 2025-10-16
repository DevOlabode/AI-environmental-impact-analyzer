/**
 * Utility functions for goal-related calculations
 */

/**
 * Calculate days remaining until a goal's end date
 * @param {Date|string} endDate - The goal's end date
 * @param {Date} currentDate - Current date (defaults to new Date())
 * @returns {Object} Object containing days remaining and status information
 */
function calculateDaysRemaining(endDate, currentDate = new Date()) {
    const end = new Date(endDate);
    const now = new Date(currentDate);
    
    // Set time to start of day for accurate day calculation
    end.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    const timeDiff = end - now;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return {
        daysRemaining: Math.max(0, daysRemaining),
        isExpired: daysRemaining < 0,
        isEndingToday: daysRemaining === 0,
        isActive: daysRemaining > 0
    };
}

/**
 * Calculate progress percentage for a goal
 * @param {number} currentValue - Current CO2 emissions
 * @param {number} targetValue - Target CO2 reduction
 * @returns {number} Progress percentage (0-100)
 */
function calculateProgress(currentValue, targetValue) {
    if (targetValue <= 0) return 0;
    const progress = Math.max(0, Math.min(100, Math.round((currentValue / targetValue) * 100)));
    return progress;
}

/**
 * Format days remaining for display
 * @param {number} days - Number of days remaining
 * @returns {string} Formatted string for display
 */
function formatDaysRemaining(days) {
    if (days === 0) return 'Ends today';
    if (days === 1) return '1 day remaining';
    return `${days} days remaining`;
}

/**
 * Get status badge class based on goal status
 * @param {boolean} isExpired - Whether the goal is expired
 * @param {boolean} isEndingToday - Whether the goal ends today
 * @param {boolean} goalReached - Whether the goal has been achieved
 * @returns {string} CSS class for status badge
 */
function getStatusBadgeClass(isExpired, isEndingToday, goalReached) {
    if (goalReached) return 'bg-success';
    if (isExpired) return 'bg-danger';
    if (isEndingToday) return 'bg-warning';
    return 'bg-info';
}

/**
 * Get status text based on goal status
 * @param {boolean} isExpired - Whether the goal is expired
 * @param {boolean} isEndingToday - Whether the goal ends today
 * @param {boolean} goalReached - Whether the goal has been achieved
 * @returns {string} Status text
 */
function getStatusText(isExpired, isEndingToday, goalReached) {
    if (goalReached) return 'Achieved';
    if (isExpired) return 'Expired';
    if (isEndingToday) return 'Ends Today';
    return 'Ongoing';
}

module.exports = {
    calculateDaysRemaining,
    calculateProgress,
    formatDaysRemaining,
    getStatusBadgeClass,
    getStatusText
};
