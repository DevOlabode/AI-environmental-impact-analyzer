const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const snap = document.getElementById('snap');
const startCamera = document.getElementById('start-camera');
const retake = document.getElementById('retake');
const confirm = document.getElementById('confirm');

let currentStream = null;

// Request camera access when "Start Camera" button is clicked
startCamera.addEventListener('click', () => {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      currentStream = stream;
      video.srcObject = stream;
      document.getElementById('camera-container').style.display = 'block';
      startCamera.style.display = 'none';
      snap.style.display = 'block';
    })
    .catch(error => {
      console.error('Error accessing camera:', error);
      alert('Camera access denied or not available. Please allow camera access to take photos.');
    });
});

// Take photo when "Take Photo" button is clicked
snap.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  // Convert to Base64
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  preview.src = dataUrl;

  // Hide camera, show preview
  document.getElementById('camera-container').style.display = 'none';
  snap.style.display = 'none';
  document.getElementById('preview-container').style.display = 'block';
});

// Retake photo
retake.addEventListener('click', () => {
  document.getElementById('preview-container').style.display = 'none';
  document.getElementById('camera-container').style.display = 'block';
  snap.style.display = 'block';
});

// Confirm and analyze
confirm.addEventListener('click', () => {
  const dataUrl = preview.src;

  // Disable buttons during processing
  retake.disabled = true;
  confirm.disabled = true;
  confirm.textContent = 'Processing...';

  // Send to server
  fetch('/analyseReciept', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: dataUrl })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Receipt processed! ' + data.message);
      if (data.products > 0) {
        alert(`Created ${data.products} product(s).`);
      }
      window.location.href = data.redirect;
    } else {
      alert('Upload failed: ' + (data.error || 'Unknown error'));
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Network error occurred during upload.');
  })
  .finally(() => {
    // Re-enable buttons
    retake.disabled = false;
    confirm.disabled = false;
    confirm.textContent = 'Confirm & Analyze';
  });
});

// Function to stop camera
function stopCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
}

// Stop camera when page unloads
window.addEventListener('beforeunload', stopCamera);
