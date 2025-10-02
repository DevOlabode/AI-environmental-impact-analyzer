const form = document.querySelector('#password');
const profileButton = document.querySelector('.edit-button');

document.addEventListener('DOMContentLoaded', () => {
    profileButton.addEventListener('click', () => {
        form.style.display = form.style.display === 'block' ? 'none' : 'block';
    });
});

const passwordButton = document.querySelector('.password-reset-button');
const passwordForm = document.querySelector('#password-reset');

document.addEventListener('DOMContentLoaded', () => {
    passwordButton.addEventListener('click', () => {
        passwordForm.style.display = form.style.display === 'block' ? 'none' : 'block';
    });
});
