import express from 'express';
import Pet from '../models/Pet.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all pets with filtering and pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      species,
      breed,
      age,
      gender,
      size,
      location,
      search,
      status = 'available',
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status };
    
    if (species) filter.species = species;
    if (breed) filter.breed = new RegExp(breed, 'i');
    if (gender) filter.gender = gender;
    if (size) filter.size = size;
    if (location) {
      filter.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') }
      ];
    }
    if (featured !== undefined) filter.featured = featured === 'true';
    
    // Age filtering
    if (age) {
      if (age === 'young') filter.age = { $lte: 2 };
      else if (age === 'adult') filter.age = { $gte: 3, $lte: 6 };
      else if (age === 'senior') filter.age = { $gte: 7 };
    }

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const pets = await Pet.find(filter)
      .populate('addedBy', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Pet.countDocuments(filter);

    res.json({
      pets,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch pets', 
      error: error.message 
    });
  }
});

// Get single pet by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('addedBy', 'name email')
      .populate('inquiries.userId', 'name');

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Increment view count
    await pet.incrementViews();

    res.json({ pet });
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch pet', 
      error: error.message 
    });
  }
});

// Create new pet (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const petData = {
      ...req.body,
      addedBy: req.user._id
    };

    const pet = new Pet(petData);
    await pet.save();

    const populatedPet = await Pet.findById(pet._id).populate('addedBy', 'name');

    res.status(201).json({
      message: 'Pet added successfully',
      pet: populatedPet
    });
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(400).json({ 
      message: 'Failed to add pet', 
      error: error.message 
    });
  }
});

// Update pet (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('addedBy', 'name');

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json({
      message: 'Pet updated successfully',
      pet
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(400).json({ 
      message: 'Failed to update pet', 
      error: error.message 
    });
  }
});

// Delete pet (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ 
      message: 'Failed to delete pet', 
      error: error.message 
    });
  }
});

// Submit adoption inquiry
router.post('/:id/inquire', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.status !== 'available') {
      return res.status(400).json({ message: 'Pet is not available for adoption' });
    }

    // Check if user already has a pending inquiry
    const existingInquiry = pet.inquiries.find(
      inquiry => inquiry.userId.toString() === req.user._id.toString() && 
                 inquiry.status === 'pending'
    );

    if (existingInquiry) {
      return res.status(400).json({ message: 'You already have a pending inquiry for this pet' });
    }

    pet.inquiries.push({
      userId: req.user._id,
      message,
      status: 'pending'
    });

    await pet.save();

    res.json({ message: 'Adoption inquiry submitted successfully' });
  } catch (error) {
    console.error('Adoption inquiry error:', error);
    res.status(500).json({ 
      message: 'Failed to submit inquiry', 
      error: error.message 
    });
  }
});

// Get pet statistics (Admin only)
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await Pet.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          available: { $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } },
          adopted: { $sum: { $cond: [{ $eq: ['$status', 'adopted'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } }
        }
      }
    ]);

    const speciesStats = await Pet.aggregate([
      { $group: { _id: '$species', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: stats[0] || { total: 0, available: 0, adopted: 0, pending: 0 },
      bySpecies: speciesStats
    });
  } catch (error) {
    console.error('Pet stats error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch pet statistics', 
      error: error.message 
    });
  }
});

export default router;