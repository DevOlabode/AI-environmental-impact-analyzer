# TODO: Create Footer Link Pages

## 1. Update Controllers and Routes
- [x] Add controller functions for helpCenter, contactUs, privacyPolicy, termsOfService in controllers/footerLinks.js
- [x] Add routes for /help-center, /contact-us, /privacy-policy, /terms-of-service in routes/footerLinks.js

## 2. Update Footer Links
- [x] Update views/partials/footer.ejs to link to the new routes instead of #

## 3. Create EJS Files
- [x] Create views/footerLinks/helpCenter.ejs with help center content
- [x] Create views/footerLinks/contactUs.ejs with contact form and AI chatbot
- [x] Create views/footerLinks/privacyPolicy.ejs with required sections
- [x] Create views/footerLinks/termsOfService.ejs with required sections, including account termination mention

## 4. Test and Verify
- [ ] Ensure all pages render correctly with dark mode toggle
- [ ] Verify chatbot functionality (frontend only)
- [ ] Check form is present (frontend only)
- [ ] Confirm links in footer work
