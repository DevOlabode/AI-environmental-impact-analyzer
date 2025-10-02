# TODO: Implement Email Verification Code for Password Change

- [x] Update models/user.js to add resetCode and resetCodeExpires fields
- [x] Add sendResetCode controller function in controllers/auth.js
- [x] Add POST /send-reset-code route in routes/auth.js
- [x] Modify public/js/user.js to make AJAX call to /send-reset-code on button click
- [x] Add POST /reset-password route and controller function for code verification
