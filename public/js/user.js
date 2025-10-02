document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.querySelector('.edit-button');
    const editForm = document.querySelector('#password');
    const passwordButton = document.querySelector('.password-reset-button');
    const passwordForm = document.querySelector('#password-reset');

    editButton.addEventListener('click', () => {
        passwordForm.style.display = 'none';
        editForm.style.display = editForm.style.display === 'block' ? 'none' : 'block';
    });

    passwordButton.addEventListener('click', () => {
        editForm.style.display = 'none';
        passwordForm.style.display = passwordForm.style.display === 'block' ? 'none' : 'block';
    });
});
