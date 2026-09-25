import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Pet from '../models/Pet.js';
import { requireAdmin } from '../middleware/auth.js';
import { sendEmail, templates } from '../services/email.js';

const router = express.Router();

const GST_RATE = parseFloat(process.env.GST_RATE || '0.18');
const FREE_SHIPPING_OVER = parseFloat(process.env.FREE_SHIPPING_OVER || '2999');
const SHIPPING_FLAT = parseFloat(process.env.SHIPPING_FLAT || '49');

// Admin: Get all orders
router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNumber: new RegExp(search, 'i') },
        { 'shippingAddress.name': new RegExp(search, 'i') }
      ];
    }

    const orders = await Order.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get user's orders
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch order', 
      error: error.message 
    });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Validate and calculate pricing
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      let itemData;
      
      if (item.itemType === 'product') {
        itemData = await Product.findById(item.itemId);
        if (!itemData || itemData.status !== 'active') {
          return res.status(400).json({ message: `Product ${item.itemId} is not available` });
        }
        if (itemData.inventory.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${itemData.name}` });
        }
      } else if (item.itemType === 'pet') {
        itemData = await Pet.findById(item.itemId);
        if (!itemData || itemData.status !== 'available') {
          return res.status(400).json({ message: `Pet ${item.itemId} is not available` });
        }
        if (item.quantity !== 1) {
          return res.status(400).json({ message: 'Pet adoption quantity must be 1' });
        }
      } else {
        itemData = await Product.findById(item.itemId);
        if (!itemData) {
          return res.status(400).json({ message: `Item ${item.itemId} not found` });
        }
      }

      const price = item.itemType === 'product' ? itemData.price : (itemData.adoptionFee || itemData.price);
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        itemId: item.itemId,
        itemType: item.itemType || 'product',
        name: itemData.name,
        price: price,
        quantity: item.quantity,
        image: itemData.primaryImage || itemData.images?.[0]?.url
      });
    }

    // Calculate tax and shipping (INR)
    const tax = subtotal * GST_RATE;
    const shipping = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
    const total = subtotal + tax + shipping;

    // Validate payment method
    const allowedMethods = ['cod', 'razorpay', 'card'];
    const finalMethod = allowedMethods.includes(paymentMethod) ? paymentMethod : 'cod';

    // Generate order number
    const count = await Order.countDocuments();
    const orderNumber = `ORD-${String(count + 1).padStart(6, '0')}`;

    // Create order
    const order = new Order({
      orderNumber,
      userId: req.user._id,
      items: orderItems,
      pricing: {
        subtotal,
        tax,
        shipping,
        total
      },
      shippingAddress,
      billingAddress: billingAddress || { ...shippingAddress, sameAsShipping: true },
      payment: {
        method: finalMethod,
        status: 'pending'
      }
    });

    await order.save();

    // Send order confirmation email (non-blocking)
    if (req.user?.email) {
      const mail = templates.orderConfirmation(order);
      sendEmail({ to: req.user.email, subject: mail.subject, html: mail.html, type: 'order_confirmation' }).catch(() => {});
    }

    // Update inventory for products
    for (const item of items) {
      if (item.itemType === 'product') {
        await Product.findByIdAndUpdate(
          item.itemId,
          { $inc: { 'inventory.stock': -item.quantity } }
        );
      } else if (item.itemType === 'pet') {
        await Pet.findByIdAndUpdate(
          item.itemId,
          { status: 'pending' }
        );
      }
    }

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({ 
      message: 'Failed to create order', 
      error: error.message 
    });
  }
});

// Cancel order
router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    // Restore inventory
    for (const item of order.items) {
      if (item.itemType === 'product') {
        await Product.findByIdAndUpdate(
          item.itemId,
          { $inc: { 'inventory.stock': item.quantity } }
        );
      } else if (item.itemType === 'pet') {
        await Pet.findByIdAndUpdate(
          item.itemId,
          { status: 'available' }
        );
      }
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      note: 'Cancelled by customer',
      updatedBy: req.user._id
    });

    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      message: 'Failed to cancel order', 
      error: error.message 
    });
  }
});

// Admin: Update order status
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, note, trackingNumber, carrier } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      note,
      updatedBy: req.user._id
    });

    // COD: mark payment completed when delivered
    if (status === 'delivered' && order.payment.method === 'cod' && order.payment.status !== 'completed') {
      order.payment.status = 'completed';
      order.payment.paidAt = new Date();
      order.payment.transactionId = `COD-${order.orderNumber}`;
    }

    if (trackingNumber) {
      order.tracking.trackingNumber = trackingNumber;
      order.tracking.carrier = carrier;
    }

    await order.save();

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      message: 'Failed to update order status', 
      error: error.message 
    });
  }
});

export default router;