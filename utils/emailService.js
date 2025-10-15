const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false 
  }
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.log('Email transporter error:', error);
  } else {
    console.log('Email transporter is ready');
  }
});

const sendPasswordResetCode = async (email, resetCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'AI Environmental Analysis - Password Reset Code',
    text: `
    Hello,
We've received a request to reset your password for your AI Environmental Analysis account.
🔐 Your password reset code is: ${resetCode}
This code will expire in 15 minutes for security purposes.
If you did not initiate this request, please disregard this message. No changes will be made to your account.
Thank you for helping us protect your access to environmental insights.
Best regards,
AI Environmental Analysis Team
`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

const sendFeedback = async (email, username, feedback) => {
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL,
  subject: 'AI Environmental Analysis - User Feedback',
  text: `
==============================
📝 New User Feedback Received
==============================

👤 Username: ${username}
📧 Email: ${email}

💬 Feedback:
${feedback}

------------------------------
Sent from AI Environmental Impact Analyzer
  `
};


    try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendPasswordResetCode, sendFeedback };