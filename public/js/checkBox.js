document.addEventListener('DOMContentLoaded', function() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const productCheckboxes = document.querySelectorAll('.product-checkbox');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const selectedCount = document.getElementById('selectedCount');

    // Update bulk delete button state
    function updateBulkDeleteButton() {
        const checkedBoxes = document.querySelectorAll('.product-checkbox:checked');
        const count = checkedBoxes.length;
        selectedCount.textContent = count;
        bulkDeleteBtn.disabled = count === 0;
    }

    // Handle select all checkbox
    selectAllCheckbox.addEventListener('change', function() {
        productCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateBulkDeleteButton();
    });

    // Handle individual checkboxes
    productCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const totalCheckboxes = productCheckboxes.length;
            const checkedBoxes = document.querySelectorAll('.product-checkbox:checked').length;

            // Update select all checkbox state
            selectAllCheckbox.checked = checkedBoxes === totalCheckboxes;
            selectAllCheckbox.indeterminate = checkedBoxes > 0 && checkedBoxes < totalCheckboxes;

            updateBulkDeleteButton();
        });
    });

    // Handle bulk delete - now just shows confirmation
    bulkDeleteBtn.addEventListener('click', function() {
        const checkedBoxes = document.querySelectorAll('.product-checkbox:checked');
        if (checkedBoxes.length === 0) return;

        return confirm(`Are you sure you want to delete ${checkedBoxes.length} product(s)? This action cannot be undone.`);
    });
});