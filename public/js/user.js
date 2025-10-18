document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing user.js');
    const editButton = document.querySelector('.edit-button');
    const editForm = document.querySelector('#edit-profile');
    const passwordButton = document.querySelector('.password-reset-button');
    const passwordForm = document.querySelector('#password');

    console.log('Elements found:', { editButton, editForm, passwordButton, passwordForm });

    if (editButton && editForm && passwordButton && passwordForm) {
        editButton.addEventListener('click', () => {
            console.log('Edit button clicked');
            editForm.style.display = editForm.style.display === 'block' ? 'none' : 'block';
            passwordForm.style.display = 'none'; // Hide password form when edit is shown
            console.log('Edit form display:', editForm.style.display);
        });

        passwordButton.addEventListener('click', () => {
            console.log('Password button clicked');
            passwordForm.style.display = passwordForm.style.display === 'block' ? 'none' : 'block';
            editForm.style.display = 'none'; // Hide edit form when password is shown
            console.log('Password form display:', passwordForm.style.display);
        });
    } else {
        console.error('Some elements not found');
    }
});
