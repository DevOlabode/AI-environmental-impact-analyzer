const {contactUs} = require('../utils/emailService');

module.exports.handleContactForm = async (req, res) => {
    const { name, email, subject, message } = req.body;
    const contact  = await contactUs(name, email, subject, message);
    if(contact.success){
        req.flash('success', 'Your message has been sent successfully! We will get back to you soon.');
        res.redirect('/contact-us');
    } else {
        req.flash('error', 'There was an error sending your message. Please try again later.');
        res.redirect('/contact-us');
    }
};