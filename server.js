require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sendEmail } = require('./middleware/sendEmail');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Email Template (keep your existing template)
const createEmailTemplate = (data, type) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .email-container { max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; }
    .header { background-color: #3B82F6; padding: 30px; text-align: center; }
    .logo { max-width: 150px; height: auto; }
    .content { padding: 30px; background-color: #f8fafc; }
    .detail-item { margin-bottom: 15px; padding: 15px; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .footer { text-align: center; padding: 20px; background-color: #e2e8f0; color: #64748b; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://your-domain.com/logo.png" alt="Harbour Sparkle Logo" class="logo">
      <h1 style="color: white; margin-top: 15px;">New ${type === 'contact' ? 'Contact Request' : 'Booking'}</h1>
    </div>
    
    <div class="content">
      ${Object.entries(data).map(([key, value]) => `
        <div class="detail-item">
          <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
          <p>${value}</p>
        </div>
      `).join('')}
    </div>

    <div class="footer">
      <p>Harbour Sparkle Cleaning Services</p>
      <p>11 Webb Street, Riverwood, Sydney, Australia</p>
      <p>✆ +61 452 548 441 | ✉ harboursparkle@gmail.com</p>
    </div>
  </div>
</body>
</html>
`;

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        await sendEmail({
            email: process.env.ADMIN_EMAIL,
            subject: 'New Contact Form Submission',
            html: createEmailTemplate({ name, email, phone, message }, 'contact'),
            text: `New contact submission:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

// Booking Form Endpoint
app.post('/api/booking', async (req, res) => {
    try {
        const { name, phone, contactPreference, service, message } = req.body;

        await sendEmail({
            email: process.env.ADMIN_EMAIL,
            subject: `New Booking: ${service}`,
            html: createEmailTemplate({ name, phone, contactPreference, service, message }, 'booking'),
            text: `New booking request:\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Booking form error:', error);
        res.status(500).json({ success: false, error: 'Failed to submit booking' });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Harbour Sparkle API!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});