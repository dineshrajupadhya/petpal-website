import nodemailer from 'nodemailer';
import EmailLog from '../models/EmailLog.js';

export const smtpConfigured = () => {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
};

let transporter = null;
const getTransporter = () => {
  if (transporter) return transporter;
  if (!smtpConfigured()) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: parseInt(process.env.SMTP_PORT || '587') === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return transporter;
};

export const sendEmail = async ({ to, subject, html, text, type = 'other' }) => {
  const log = await EmailLog.create({ to, subject, html, text, type, status: 'queued' });
  const tx = getTransporter();
  if (!tx) {
    return { ok: true, queued: true, logId: log._id };
  }
  try {
    await tx.sendMail({
      from: process.env.SMTP_FROM || `PetPal <${process.env.SMTP_USER}>`,
      to, subject, html, text
    });
    log.status = 'sent';
    log.sentAt = new Date();
    await log.save();
    return { ok: true, logId: log._id };
  } catch (error) {
    log.status = 'failed';
    log.error = error.message;
    await log.save();
    return { ok: false, error: error.message, logId: log._id };
  }
};

const wrap = (title, bodyHtml) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff">
  <div style="text-align:center;margin-bottom:24px">
    <span style="font-size:24px;font-weight:bold;color:#2563eb">PetPal</span>
  </div>
  <h2 style="color:#111827;margin-top:0">${title}</h2>
  ${bodyHtml}
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
  <p style="color:#6b7280;font-size:12px;text-align:center">© ${new Date().getFullYear()} PetPal. All rights reserved.</p>
</div>`;

export const templates = {
  welcome: (name) => ({
    subject: 'Welcome to PetPal!',
    html: wrap(`Welcome, ${name}!`, `<p>Your PetPal account has been created. Browse pets for adoption, shop pet supplies, and more.</p><p style="text-align:center;margin:24px 0"><a href="${process.env.FRONTEND_URL || 'https://petpal-platform.netlify.app'}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Visit PetPal</a></p>`)
  }),
  passwordReset: (name, resetUrl) => ({
    subject: 'Reset your PetPal password',
    html: wrap(`Hi ${name},`, `<p>We received a request to reset your password. Click the button below to choose a new one. The link expires in 1 hour.</p><p style="text-align:center;margin:24px 0"><a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Reset Password</a></p><p style="color:#6b7280;font-size:13px">If you didn't request this, you can safely ignore this email.</p>`)
  }),
  orderConfirmation: (order) => ({
    subject: `Order ${order.orderNumber} confirmed`,
    html: wrap(`Thanks for your order, ${order.shippingAddress?.name || 'customer'}!`, `
      <p>Order <strong>${order.orderNumber}</strong> has been placed successfully.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        ${order.items.map(i => `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb">${i.name} × ${i.quantity}</td><td style="text-align:right;border-bottom:1px solid #e5e7eb">₹${i.price * i.quantity}</td></tr>`).join('')}
        <tr><td style="padding:12px 0;font-weight:bold">Total (incl. tax & shipping)</td><td style="text-align:right;font-weight:bold;padding:12px 0">₹${order.pricing.total}</td></tr>
      </table>
      <p>Payment: <strong>${(order.payment?.method || '').toUpperCase()}</strong> — you'll pay ${order.payment?.method === 'cod' ? 'on delivery' : 'as processed'}.</p>
      <p>You can track this order in your profile.</p>`)
  }),
  adoptionSubmitted: (name, petName) => ({
    subject: `Adoption application received for ${petName}`,
    html: wrap(`Hi ${name},`, `<p>Your adoption application for <strong>${petName}</strong> has been received. Our team will review it within 2-3 business days and get back to you.</p>`)
  }),
  contact: (name, email, message) => ({
    subject: `New message from ${name} (PetPal contact form)`,
    html: wrap(`New contact form message`, `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p style="white-space:pre-wrap">${message}</p>`)
  })
};
