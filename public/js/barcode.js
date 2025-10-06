let html5QrcodeScanner = null;
let cameras = [];

// Get available cameras
async function getCameras() {
    try {
        const devices = await Html5Qrcode.getCameras();
        cameras = devices;
        const select = document.getElementById('cameraSelect');
        select.innerHTML = '';
        
        if (devices.length === 0) {
            select.innerHTML = '<option value="">No cameras found</option>';
            return;
        }

        devices.forEach((device, index) => {
            const option = document.createElement('option');
            option.value = device.id;
            option.text = device.label || `Camera ${index + 1}`;
            select.appendChild(option);
        });

        // Select back camera by default on mobile
        const backCamera = devices.find(d => d.label.toLowerCase().includes('back'));
        if (backCamera) {
            select.value = backCamera.id;
        }
    } catch (error) {
        console.error('Error getting cameras:', error);
        updateStatus('Error accessing cameras. Please grant camera permissions.', 'danger');
    }
}

// Update status message
function updateStatus(message, type = 'info') {
    const statusDiv = document.getElementById('scannerStatus');
    statusDiv.className = `alert alert-${type}`;
    statusDiv.innerHTML = `<i class="fas fa-${type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
}

// Start scanner
document.getElementById('startBtn').addEventListener('click', async () => {
    const cameraId = document.getElementById('cameraSelect').value;

    if (!cameraId) {
        updateStatus('Please select a camera first', 'warning');
        return;
    }

    try {
        html5QrcodeScanner = new Html5Qrcode("videoContainer");

        document.getElementById('videoContainer').style.display = 'block';
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('scanNowBtn').style.display = 'inline-block';
        document.getElementById('stopBtn').style.display = 'inline-block';

        updateStatus('Camera started. Click "Scan Now" to scan.', 'success');

        await html5QrcodeScanner.start(
            cameraId,
            {
                fps: 10,
                qrbox: { width: 250, height: 150 }
            },
            (decodedText, decodedResult) => {
                // Ignore continuous scan results to prevent duplicate scans
            },
            (error) => {
                // Ignore scan failure errors
            }
        );
    } catch (error) {
        console.error('Error starting scanner:', error);
        updateStatus('Failed to start camera: ' + error, 'danger');
        stopScanner();
    }
});

// Stop scanner
document.getElementById('stopBtn').addEventListener('click', stopScanner);

document.getElementById('scanNowBtn').addEventListener('click', async () => {
    try {
        updateStatus('Scanning...', 'info');
        // Use scanFile with a file input dialog for manual scan
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) {
                updateStatus('No file selected', 'warning');
                return;
            }
            try {
                await Html5Qrcode.scanFile(file, false, onScanSuccess, onScanFailure);
            } catch (error) {
                updateStatus('Scan failed: ' + error, 'danger');
            }
        };
        fileInput.click();
    } catch (error) {
        updateStatus('Scan failed: ' + error, 'danger');
    }
});

function stopScanner() {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.stop().then(() => {
            document.getElementById('videoContainer').style.display = 'none';
            document.getElementById('startBtn').style.display = 'inline-block';
            document.getElementById('scanNowBtn').style.display = 'none';
            document.getElementById('stopBtn').style.display = 'none';
            updateStatus('Scanner stopped', 'info');
        }).catch(err => {
            console.error('Error stopping scanner:', err);
        });
    }
}

// Handle successful scan
async function onScanSuccess(decodedText, decodedResult) {
    console.log(`Barcode detected: ${decodedText}`);
    updateStatus(`Barcode detected: ${decodedText}. Looking up product...`, 'success');
    
    stopScanner();
    await lookupBarcode(decodedText);
}

function onScanFailure(error) {
    // Ignore scan failures (too noisy)
}

// Look up barcode
async function lookupBarcode(barcode) {
    try {
        const response = await fetch('/lookup-barcode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ barcode })
        });

        const data = await response.json();

        if (data.success) {
            if (data.exists) {
                updateStatus('Product already in your collection!', 'info');
                window.location.href = `/form/show-products/${data.product._id}`;
            } else {
                // Pre-fill form with product data
                document.getElementById('barcode').value = barcode;
                document.getElementById('name').value = data.product.name;
                document.getElementById('brand').value = data.product.brand;
                document.getElementById('category').value = data.product.category;
                document.getElementById('material').value = data.product.material || '';
                document.getElementById('weight').value = data.product.weight || '';
                document.getElementById('originCountry').value = data.product.originCountry || '';
                
                document.getElementById('productFormCard').style.display = 'block';
                document.getElementById('productFormCard').scrollIntoView({ behavior: 'smooth' });
                updateStatus('Product found! Please verify details and add price.', 'success');
            }
        } else {
            updateStatus(data.message, 'warning');
            // Show empty form for manual entry
            document.getElementById('barcode').value = barcode;
            document.getElementById('productFormCard').style.display = 'block';
            document.getElementById('productFormCard').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error looking up barcode:', error);
        updateStatus('Error looking up product. Please try again.', 'danger');
    }
}

// Manual barcode lookup
document.getElementById('manualLookupBtn').addEventListener('click', async () => {
    const barcode = document.getElementById('manualBarcode').value.trim();
    
    if (!barcode) {
        updateStatus('Please enter a barcode number', 'warning');
        return;
    }

    updateStatus('Looking up barcode...', 'info');
    await lookupBarcode(barcode);
});

// Handle form submission
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Analyzing...';

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/save-scanned-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            window.location.href = result.redirect;
        } else {
            updateStatus('Error: ' + result.message, 'danger');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    } catch (error) {
        console.error('Error saving product:', error);
        updateStatus('Error saving product. Please try again.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});

// Cancel button
document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('productFormCard').style.display = 'none';
    document.getElementById('productForm').reset();
    updateStatus('Click "Start Scanner" to scan another product', 'info');
});

// Initialize cameras on page load
getCameras();
