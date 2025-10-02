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
    subject: 'Expense Tracker - Password Reset Code',
    text: `
Expense Tracker - Password Reset Request

Your password reset code is: ${resetCode}

This code will expire in 15 minutes.

If you didn't request this password reset, please ignore this email.

Best regards,
Expense Tracker Team
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

module.exports = { sendPasswordResetCode };