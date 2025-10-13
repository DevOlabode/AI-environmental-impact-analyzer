// JavaScript to handle collapse toggle icons
document.addEventListener('DOMContentLoaded', function() {
    // Function to update toggle button icon based on collapse state
    function updateToggleIcon(collapseElement, button) {
        const isExpanded = collapseElement.classList.contains('show');
        const icon = button.querySelector('i');

        if (isExpanded) {
            icon.className = 'fas fa-chevron-up';
        } else {
            icon.className = 'fas fa-chevron-down';
        }
    }

    // Add event listeners to all collapse toggles
    const collapseToggles = document.querySelectorAll('[data-bs-toggle="collapse"]');

    collapseToggles.forEach(button => {
        const targetId = button.getAttribute('data-bs-target');
        const collapseElement = document.querySelector(targetId);

        if (collapseElement) {
            // Update icon on collapse events
            collapseElement.addEventListener('shown.bs.collapse', function() {
                updateToggleIcon(collapseElement, button);
            });

            collapseElement.addEventListener('hidden.bs.collapse', function() {
                updateToggleIcon(collapseElement, button);
            });

            // Set initial icon state
            updateToggleIcon(collapseElement, button);
        }
    });
});
