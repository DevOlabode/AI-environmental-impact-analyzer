// Show/hide date fields based on timeframe selection
document.getElementById('timeframe').addEventListener('change', function() {
    const startDateContainer = document.getElementById('startDateContainer');
    const endDateContainer = document.getElementById('endDateContainer');

    if (this.value === 'custom') {
        // Show both start and end date for custom period
        startDateContainer.style.display = 'block';
        endDateContainer.style.display = 'block';
    } else if (this.value === 'monthly' || this.value === 'quarterly' || this.value === 'yearly') {
        // Show only start date for predefined periods
        startDateContainer.style.display = 'block';
        endDateContainer.style.display = 'none';
    } else {
        // Hide both if no timeframe selected
        startDateContainer.style.display = 'none';
        endDateContainer.style.display = 'none';
    }
});

// Form validation
document.getElementById('goalForm').addEventListener('submit', function(e) {
    const reductionAmount = document.getElementById('reductionAmount').value;
    const timeframe = document.getElementById('timeframe').value;

    if (!reductionAmount || reductionAmount <= 0) {
        e.preventDefault();
        alert('Please enter a valid CO2 reduction target greater than 0.');
        return;
    }

    if (!timeframe) {
        e.preventDefault();
        alert('Please select a timeframe for your goal.');
        return;
    }

    // Additional validation for custom dates
    if (timeframe === 'custom') {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (!startDate || !endDate) {
            e.preventDefault();
            alert('Please select both start and end dates for your custom period.');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            e.preventDefault();
            alert('End date must be after the start date.');
            return;
        }
    }
});