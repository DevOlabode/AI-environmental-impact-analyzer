document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.querySelector('.edit-button');
    const editForm = document.querySelector('#edit-profile');
    const passwordButton = document.querySelector('.password-reset-button');
    const passwordForm = document.querySelector('#password');

    editButton.addEventListener('click', () => {
        editForm.style.display = editForm.style.display === 'block' ? 'none' : 'block';
        passwordForm.style.display = 'none'; // Hide password form when edit is shown
    });

    passwordButton.addEventListener('click', () => {
        passwordForm.style.display = passwordForm.style.display === 'block' ? 'none' : 'block';
        editForm.style.display = 'none'; // Hide edit form when password is shown
    });
});
