import express from 'express';
import Disease from '../models/Disease.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all diseases with filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      species,
      category,
      severity,
      search,
      symptoms
    } = req.query;

    // Build filter object
    const filter = { isPublished: true };
    
    if (species) filter.species = { $in: [species, 'All'] };
    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    
    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Symptom filtering
    if (symptoms) {
      const symptomArray = Array.isArray(symptoms) ? symptoms : [symptoms];
      filter['symptoms.name'] = { $in: symptomArray.map(s => new RegExp(s, 'i')) };
    }

    // Execute query with pagination
    const diseases = await Disease.find(filter)
      .select('-references -lastReviewed -reviewedBy')
      .sort({ views: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Disease.countDocuments(filter);

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

// Get single disease by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id)
      .populate('relatedDiseases', 'name species severity');

    if (!disease || !disease.isPublished) {
      return res.status(404).json({ message: 'Disease information not found' });
    }

    // Increment view count
    await disease.incrementViews();

    res.json({ disease });
  } catch (error) {
    console.error('Get disease error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch disease information', 
      error: error.message 
    });
  }
});

// Create new disease (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const disease = new Disease(req.body);
    await disease.save();

    res.status(201).json({
      message: 'Disease information added successfully',
      disease
    });
  } catch (error) {
    console.error('Create disease error:', error);
    res.status(400).json({ 
      message: 'Failed to add disease information', 
      error: error.message 
    });
  }
});

// Update disease (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const disease = await Disease.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastReviewed: new Date() },
      { new: true, runValidators: true }
    );

    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }

    res.json({
      message: 'Disease information updated successfully',
      disease
    });
  } catch (error) {
    console.error('Update disease error:', error);
    res.status(400).json({ 
      message: 'Failed to update disease information', 
      error: error.message 
    });
  }
});

// Delete disease (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const disease = await Disease.findByIdAndDelete(req.params.id);

    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }

    res.json({ message: 'Disease information deleted successfully' });
  } catch (error) {
    console.error('Delete disease error:', error);
    res.status(500).json({ 
      message: 'Failed to delete disease information', 
      error: error.message 
    });
  }
});

// Get symptoms for symptom checker
router.get('/meta/symptoms', async (req, res) => {
  try {
    const { species } = req.query;
    
    let filter = { isPublished: true };
    if (species) {
      filter.species = { $in: [species, 'All'] };
    }

    const symptoms = await Disease.aggregate([
      { $match: filter },
      { $unwind: '$symptoms' },
      { $group: { _id: '$symptoms.name', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $project: { symptom: '$_id', count: 1, _id: 0 } }
    ]);

    res.json({ symptoms });
  } catch (error) {
    console.error('Get symptoms error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch symptoms', 
      error: error.message 
    });
  }
});

// Symptom checker - find diseases by symptoms
router.post('/symptom-checker', async (req, res) => {
  try {
    const { symptoms, species } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one symptom' });
    }

    let filter = { 
      isPublished: true,
      'symptoms.name': { $in: symptoms.map(s => new RegExp(s, 'i')) }
    };

    if (species) {
      filter.species = { $in: [species, 'All'] };
    }

    const diseases = await Disease.find(filter)
      .select('name species severity symptoms description category')
      .sort({ severity: -1 })
      .limit(10);

    // Calculate match score for each disease
    const diseasesWithScore = diseases.map(disease => {
      const matchingSymptoms = disease.symptoms.filter(symptom =>
        symptoms.some(userSymptom => 
          symptom.name.toLowerCase().includes(userSymptom.toLowerCase())
        )
      );
      
      const score = (matchingSymptoms.length / symptoms.length) * 100;
      
      return {
        ...disease.toObject(),
        matchScore: Math.round(score),
        matchingSymptoms: matchingSymptoms.map(s => s.name)
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      results: diseasesWithScore,
      disclaimer: 'This is for informational purposes only. Please consult with a veterinarian for proper diagnosis and treatment.'
    });
  } catch (error) {
    console.error('Symptom checker error:', error);
    res.status(500).json({ 
      message: 'Failed to check symptoms', 
      error: error.message 
    });
  }
});

// Get disease categories and metadata
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Disease.distinct('category');
    const species = await Disease.distinct('species');
    const severities = ['mild', 'moderate', 'severe', 'critical'];

    res.json({ categories, species, severities });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch categories', 
      error: error.message 
    });
  }
});

export default router;