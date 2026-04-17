import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Pet from '../models/Pet.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

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
      }

      const price = item.itemType === 'product' ? itemData.price : itemData.adoptionFee;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        itemId: item.itemId,
        itemType: item.itemType,
        name: itemData.name,
        price: price,
        quantity: item.quantity,
        image: itemData.primaryImage || itemData.images[0]?.url
      });
    }

    // Calculate tax and shipping
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal >= 35 ? 0 : 9.99;
    const total = subtotal + tax + shipping;

    // Create order
    const order = new Order({
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
        method: paymentMethod,
        status: 'pending'
      }
    });

    await order.save();

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