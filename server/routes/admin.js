import express from 'express';
import User from '../models/User.js';
import Pet from '../models/Pet.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Chat from '../models/Chat.js';
import Disease from '../models/Disease.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(requireAdmin);

// Dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const [
      userStats,
      petStats,
      productStats,
      orderStats,
      chatStats
    ] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: ['$isActive', 1, 0] } },
            admins: { $sum: { $cond: ['$isAdmin', 1, 0] } }
          }
        }
      ]),
      Pet.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            available: { $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } },
            adopted: { $sum: { $cond: [{ $eq: ['$status', 'adopted'] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } }
          }
        }
      ]),
      Product.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            lowStock: { $sum: { $cond: [{ $lte: ['$inventory.stock', '$inventory.lowStockThreshold'] }, 1, 0] } }
          }
        }
      ]),
      Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
            revenue: { $sum: '$pricing.total' }
          }
        }
      ]),
      Chat.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
          }
        }
      ])
    ]);

    // Recent activity
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber status pricing.total createdAt');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt isActive');

    const recentChats = await Chat.find()
      .populate('userId', 'name')
      .sort({ lastActivity: -1 })
      .limit(5)
      .select('userId status priority lastActivity');

    res.json({
      stats: {
        users: userStats[0] || { total: 0, active: 0, admins: 0 },
        pets: petStats[0] || { total: 0, available: 0, adopted: 0, pending: 0 },
        products: productStats[0] || { total: 0, active: 0, lowStock: 0 },
        orders: orderStats[0] || { total: 0, pending: 0, completed: 0, revenue: 0 },
        chats: chatStats[0] || { total: 0, active: 0, resolved: 0 }
      },
      recentActivity: {
        orders: recentOrders,
        users: recentUsers,
        chats: recentChats
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dashboard statistics', 
      error: error.message 
    });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    
    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }
    if (status) filter.isActive = status === 'active';

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch users', 
      error: error.message 
    });
  }
});

// Update user status
router.put('/users/:id/status', async (req, res) => {
  try {
    const { isActive, isAdmin } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive, isAdmin },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'User status updated successfully',
      user 
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ 
      message: 'Failed to update user status', 
      error: error.message 
    });
  }
});

// Analytics endpoints
router.get('/analytics/sales', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    if (period === '7d') {
      dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
    } else if (period === '30d') {
      dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
    } else if (period === '90d') {
      dateFilter = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
    }

    const salesData = await Order.aggregate([
      { $match: { createdAt: dateFilter, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({ salesData });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch sales analytics', 
      error: error.message 
    });
  }
});

// Content management
router.get('/content/diseases', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const diseases = await Disease.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Disease.countDocuments();

    res.json({
      diseases,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get diseases error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch diseases', 
      error: error.message 
    });
  }
});

// System health check
router.get('/system/health', async (req, res) => {
  try {
    const dbStatus = await User.findOne().lean() ? 'connected' : 'disconnected';
    
    res.json({
      status: 'healthy',
      database: dbStatus,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date()
    });
  }
});

export default router;