// utils/emailService.js
const nodemailer = require('nodemailer');
const config = require('config');
const logger = require('./logger');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // You can replace these with actual environment variables or config
  const host = process.env.EMAIL_HOST || 'smtp.example.com';
  const port = process.env.EMAIL_PORT || 587;
  const user = process.env.EMAIL_USER || 'your-email@example.com';
  const pass = process.env.EMAIL_PASS || 'your-password';

  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: user,
      pass: pass,
    },
  });
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email body
 * @param {string} options.html - HTML email body
 * @returns {Promise} - Resolves with info about sent email
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const from = process.env.EMAIL_FROM || 'PrivateJet <noreply@privatejet.com>';

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email error: ${error.message}`);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 * @param {string} resetUrl - Password reset URL
 * @returns {Promise} - Resolves with info about sent email
 */
const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  const subject = 'Password Reset Request';
  const text = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the following link, or paste it into your browser to complete the process: \n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;
  const html = `
    <h1>Password Reset</h1>
    <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
    <p>Please click on the following link, or paste it into your browser to complete the process:</p>
    <a href="${resetUrl}" target="_blank">Reset Password</a>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
};