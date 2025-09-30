const form = document.querySelector('.password');
const button = document.querySelector('.edit-button');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.password');
    const button = document.querySelector('.edit-button');

    button.addEventListener('click', () => {
        form.style.display = form.style.display === 'block' ? 'none' : 'block';
    });
});