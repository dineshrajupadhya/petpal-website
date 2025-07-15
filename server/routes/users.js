import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('adoptionHistory.petId', 'name breed images')
      .populate('wishlist.itemId');

    res.json({ user: user.getPublicProfile() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile', 
      error: error.message 
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, phone, address, preferences } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({ 
      message: 'Profile update failed', 
      error: error.message 
    });
  }
});

// Add to wishlist
router.post('/wishlist', async (req, res) => {
  try {
    const { itemId, itemType } = req.body;

    const user = await User.findById(req.user._id);
    
    // Check if item already in wishlist
    const existingItem = user.wishlist.find(
      item => item.itemId.toString() === itemId && item.itemType === itemType
    );

    if (existingItem) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    user.wishlist.push({ itemId, itemType });
    await user.save();

    res.json({ message: 'Item added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ 
      message: 'Failed to add to wishlist', 
      error: error.message 
    });
  }
});

// Remove from wishlist
router.delete('/wishlist/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.wishlist = user.wishlist.filter(
      item => item.itemId.toString() !== req.params.itemId
    );
    
    await user.save();

    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ 
      message: 'Failed to remove from wishlist', 
      error: error.message 
    });
  }
});

// Get wishlist
router.get('/wishlist', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist.itemId');

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch wishlist', 
      error: error.message 
    });
  }
});

// Get adoption history
router.get('/adoptions', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('adoptionHistory.petId', 'name breed images adoptionFee location');

    res.json({ adoptions: user.adoptionHistory });
  } catch (error) {
    console.error('Get adoptions error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch adoption history', 
      error: error.message 
    });
  }
});

export default router;