import express from 'express';
import AdoptionApplication from '../models/AdoptionApplication.js';
import Pet from '../models/Pet.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Submit adoption application (user)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { petId, personalInfo, housing, experience, lifestyle, references, agreement } = req.body;

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    if (pet.status !== 'available') return res.status(400).json({ message: 'Pet is not available for adoption' });

    const existing = await AdoptionApplication.findOne({ petId, userId: req.user._id, status: { $nin: ['rejected', 'withdrawn'] } });
    if (existing) return res.status(400).json({ message: 'You already have an active application for this pet' });

    const application = await AdoptionApplication.create({
      petId,
      userId: req.user._id,
      personalInfo,
      housing,
      experience,
      lifestyle,
      references,
      agreement
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
});

// Get my applications (user)
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const applications = await AdoptionApplication.find({ userId: req.user._id })
      .populate('petId', 'name species breed images')
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
});

// Get all applications (admin)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const applications = await AdoptionApplication.find(filter)
      .populate('petId', 'name species breed images adoptionFee')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    const stats = await AdoptionApplication.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({ applications, stats });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
});

// Update application status (admin)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const application = await AdoptionApplication.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    ).populate('petId', 'name species breed images').populate('userId', 'name email');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (status === 'approved') {
      await Pet.findByIdAndUpdate(application.petId._id, { status: 'pending' });
    }

    res.json({ message: 'Application updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update application', error: error.message });
  }
});

// Withdraw application (user)
router.put('/:id/withdraw', authenticateToken, async (req, res) => {
  try {
    const application = await AdoptionApplication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, status: { $in: ['pending', 'under_review'] } },
      { status: 'withdrawn' },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: 'Application not found or cannot be withdrawn' });
    res.json({ message: 'Application withdrawn', application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to withdraw application', error: error.message });
  }
});

export default router;
