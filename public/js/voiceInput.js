let recognition;
let isListening = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        isListening = true;
        document.getElementById('voiceButton').innerHTML = '<i class="fas fa-stop"></i> Listening...';
        document.getElementById('voiceButton').classList.remove('btn-primary');
        document.getElementById('voiceButton').classList.add('btn-danger');
        document.getElementById('status').textContent = 'Listening... Speak now.';
    };

    recognition.onresult = async function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('status').textContent = 'Processing with AI...';

        try {
            const response = await fetch('/voiceInput/ai/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transcript })
            });

            if (!response.ok) {
                throw new Error('Failed to process voice input');
            }

            const productData = await response.json();

            // Fill the form
            document.getElementById('product-name').value = productData.name || '';
            document.getElementById('product-brand').value = productData.brand || '';
            document.getElementById('product-category').value = productData.category || '';
            document.getElementById('product-material').value = productData.material || '';
            document.getElementById('product-weight').value = productData.weight || '';
            document.getElementById('product-originCountry').value = productData.originCountry || '';
            document.getElementById('product-price').value = productData.price || '';
            document.getElementById('product-notes').value = productData.notes || '';

            // Remove readonly from all inputs
            const inputs = document.querySelectorAll('input[readonly]');
            inputs.forEach(input => input.removeAttribute('readonly'));

            const textArea = document.querySelector('textarea');
            textArea.removeAttribute('readonly')

            document.getElementById('status').textContent = 'Form filled! Ready to analyze.';
            document.getElementById('analyzeBtn').disabled = false;

        } catch (error) {
            console.error('Error:', error);
            document.getElementById('status').textContent = 'Error processing voice input. Please try again.';
        }
    };

    recognition.onend = function() {
        isListening = false;
        document.getElementById('voiceButton').innerHTML = '<i class="fas fa-microphone"></i> Start Speaking';
        document.getElementById('voiceButton').classList.remove('btn-danger');
        document.getElementById('voiceButton').classList.add('btn-primary');
        if (!document.getElementById('product-name').value) {
            document.getElementById('status').textContent = 'Click to describe your product';
        }
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        document.getElementById('status').textContent = 'Speech recognition error: ' + event.error;
        isListening = false;
        document.getElementById('voiceButton').innerHTML = '<i class="fas fa-microphone"></i> Start Speaking';
        document.getElementById('voiceButton').classList.remove('btn-danger');
        document.getElementById('voiceButton').classList.add('btn-primary');
    };
} else {
    document.getElementById('status').textContent = 'Speech recognition not supported in this browser.';
    document.getElementById('voiceButton').disabled = true;
}

document.getElementById('voiceButton').addEventListener('click', function() {
    if (!recognition) return;
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
});