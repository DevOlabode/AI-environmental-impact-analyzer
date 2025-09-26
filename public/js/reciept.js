const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const snap = document.getElementById('snap');

let currentStream = null;

// Request camera access
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    currentStream = stream;
    video.srcObject = stream;
  })
  .catch(err => {
    console.error('Camera error:', err);
    alert('Camera access denied or not available');
  });

// Capture photo
snap.addEventListener('click', () => {
  // Disable button during processing
  snap.disabled = true;
  snap.textContent = 'Processing...';
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  
  // Convert to Base64
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG for smaller size
  preview.src = dataUrl;

  // Show preview
  document.getElementById('preview-container').style.display = 'block';

  // Send to server - make sure this matches your route
  fetch('/analyseReciept', { // or whatever your actual route is
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: dataUrl })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Receipt processed! ' + (data.message || 'Products analyzed and saved.'));
      if (data.products && data.products.length > 0) {
        alert(`Created ${data.products.length} product(s). Check your products list.`);
      }
      // Optional: Stop camera after successful capture
      stopCamera();
    } else {
      alert('Upload failed: ' + (data.error || data.message || 'Unknown error'));
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Network error occurred during upload.');
  })
  .finally(() => {
    // Re-enable button
    snap.disabled = false;
    snap.textContent = 'Take Photo';
  });
});

// Function to stop camera
function stopCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
}

// Optional: Stop camera when page unloads
window.addEventListener('beforeunload', stopCamera);