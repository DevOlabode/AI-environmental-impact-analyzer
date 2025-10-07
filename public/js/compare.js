    const productItems = document.querySelectorAll('.product-item');
    const compareBtn = document.getElementById('compareBtn');
    let selectedProducts = { product1: null, product2: null };

    productItems.forEach(item => {
        item.addEventListener('click', function() {
            const column = this.closest('.product-column');
            const isProduct1 = column.querySelector('h3').textContent === 'Product 1';

            column.querySelectorAll('.product-item').forEach(li => li.classList.remove('selected'));

            this.classList.add('selected');

            if (isProduct1) {
                selectedProducts.product1 = this.dataset.productId;
            } else {
                selectedProducts.product2 = this.dataset.productId;
            }

            compareBtn.disabled = !(selectedProducts.product1 && selectedProducts.product2);
        });
    });

    compareBtn.addEventListener('click', function() {
        if (selectedProducts.product1 && selectedProducts.product2) {
            alert(`Comparing products: ${selectedProducts.product1} and ${selectedProducts.product2}`);
        }
    });


    const product1Radios = document.querySelectorAll('input[name="product1"]');
    const product2Radios = document.querySelectorAll('input[name="product2"]');

    function updateButtonState() {
        const product1Selected = Array.from(product1Radios).some(radio => radio.checked);
        const product2Selected = Array.from(product2Radios).some(radio => radio.checked);
        compareBtn.disabled = !(product1Selected && product2Selected);
    }

    product1Radios.forEach(radio => {
        radio.addEventListener('change', updateButtonState);
    });

    product2Radios.forEach(radio => {
        radio.addEventListener('change', updateButtonState);
    });

    // Initialize button state on page load
    updateButtonState();