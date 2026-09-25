import express from 'express';
import multer from 'multer';
import Asset from '../models/Asset.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif|avif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

const publicBase = () =>
  process.env.PUBLIC_API_URL || 'https://petpal-api-ejwx.onrender.com';

// Upload image (admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });

    const asset = await Asset.create({
      data: req.file.buffer,
      contentType: req.file.mimetype,
      size: req.file.size,
      originalName: req.file.originalname
    });

    const url = `${publicBase()}/api/assets/${asset._id}`;
    asset.url = url;
    await asset.save();

    res.status(201).json({ message: 'Image uploaded', url, id: asset._id });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Serve image (public)
router.get('/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Image not found' });

    res.setHeader('Content-Type', asset.contentType);
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(asset.data);
  } catch (error) {
    res.status(404).json({ message: 'Image not found' });
  }
});

export default router;
