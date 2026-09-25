import express from 'express';
import Analytics from '../models/Analytics.js';

const router = express.Router();

// Track a page view (public, lightweight)
router.post('/track', async (req, res) => {
  try {
    const { path } = req.body;
    if (!path || typeof path !== 'string' || path.length > 200) {
      return res.status(400).json({ message: 'Invalid path' });
    }
    const date = new Date().toISOString().slice(0, 10);
    await Analytics.findOneAndUpdate(
      { date, path },
      { $inc: { views: 1 } },
      { upsert: true, new: true }
    ).catch(() => {});
    res.status(204).end();
  } catch {
    res.status(204).end();
  }
});

export default router;
