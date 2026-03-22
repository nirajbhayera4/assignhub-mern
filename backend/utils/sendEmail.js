const nodemailer = require('nodemailer');

const hasEmailConfig = () =>
  Boolean(
    process.env.EMAIL_SERVICE &&
    process.env.EMAIL_USERNAME &&
    process.env.EMAIL_PASSWORD &&
    process.env.EMAIL_USERNAME !== 'your-email@gmail.com' &&
    process.env.EMAIL_PASSWORD !== 'your-app-password'
  );

const sendEmail = async ({ to, subject, text, html }) => {
  if (!hasEmailConfig()) {
    throw new Error('Email service is not configured');
  }

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
};

module.exports = sendEmail;
