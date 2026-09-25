import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const razorpayConfigured = () =>
  !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

// Public: is Razorpay available?
router.get('/config', (req, res) => {
  res.json({
    razorpay: {
      enabled: razorpayConfigured(),
      keyId: razorpayConfigured() ? process.env.RAZORPAY_KEY_ID : null
    }
  });
});

// Create Razorpay order for a PetPal order
router.post('/razorpay/order', authenticateToken, async (req, res) => {
  try {
    if (!razorpayConfigured()) {
      return res.status(503).json({ message: 'Online payments not configured. Please use Cash on Delivery.' });
    }

    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, userId: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const amount = Math.round(order.pricing.total * 100); // paise

    const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
    const resp = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: order.orderNumber,
        notes: { petpalOrderId: order._id.toString() }
      })
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return res.status(502).json({ message: 'Failed to create payment order', error: err.error?.description || 'Unknown error' });
    }

    const rzpOrder = await resp.json();
    order.payment.razorpayOrderId = rzpOrder.id;
    await order.save();

    res.json({
      rzpOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment initialization failed', error: error.message });
  }
});

// Verify payment signature
router.post('/razorpay/verify', authenticateToken, async (req, res) => {
  try {
    if (!razorpayConfigured()) return res.status(503).json({ message: 'Online payments not configured' });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const order = await Order.findOne({ 'payment.razorpayOrderId': razorpay_order_id, userId: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const valid = expected === razorpay_signature;
    if (!valid) {
      order.payment.status = 'failed';
      await order.save();
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    order.payment.status = 'completed';
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.transactionId = razorpay_payment_id;
    order.payment.paidAt = new Date();
    await order.save();

    res.json({ message: 'Payment verified', orderId: order._id, orderNumber: order.orderNumber });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
});

export default router;
