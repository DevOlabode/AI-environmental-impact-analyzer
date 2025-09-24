const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const snap = document.getElementById('snap');

// Request camera access
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => console.error('Camera error:', err));

// Capture photo
snap.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  
  // Convert to Base64
  const dataUrl = canvas.toDataURL('image/png');
  preview.src = dataUrl;

  // Send to server
  fetch('/upload-reciept', {
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
    } else {
      alert('Upload failed: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred during upload.');
  });
});
