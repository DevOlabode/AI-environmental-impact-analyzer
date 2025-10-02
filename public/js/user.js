document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.querySelector('.edit-button');
    const editForm = document.querySelector('#password');
    const passwordButton = document.querySelector('.password-reset-button');
    const passwordForm = document.querySelector('#password-reset');

    editButton.addEventListener('click', () => {
        passwordForm.style.display = 'none';
        editForm.style.display = editForm.style.display === 'block' ? 'none' : 'block';
    });

    passwordButton.addEventListener('click', async () => {
        editForm.style.display = 'none';

        try {
            const response = await fetch('/send-reset-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                passwordForm.style.display = 'block';
                alert('A reset code has been sent to your email.');
            } else {
                alert('Failed to send reset code. Please try again later.');
            }
        } catch (error) {
            console.error('Error sending reset code:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
