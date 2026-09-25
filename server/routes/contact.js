import express from 'express';
import rateLimit from 'express-rate-limit';
import { sendEmail, templates } from '../services/email.js';

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many messages. Please try again later.' }
});

router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email' });
    }

    const to = process.env.BUSINESS_EMAIL || process.env.SMTP_USER || 'support@petpal.com';
    const mail = templates.contact(name, email, message);
    await sendEmail({ to, subject: mail.subject, html: mail.html, type: 'contact' });

    res.status(201).json({ message: 'Thanks! Your message has been sent. We will get back to you soon.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

export default router;
