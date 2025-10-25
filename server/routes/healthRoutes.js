import express from 'express';
import {
  createHealthLog,
  getHealthLogs,
  updateHealthLog,
  deleteHealthLog,
  getAnalytics,
  getAIInsights
} from '../controllers/healthController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Health log CRUD
router.post('/', createHealthLog);
router.get('/', getHealthLogs);
router.put('/:id', updateHealthLog);
router.delete('/:id', deleteHealthLog);

// Analytics and AI
router.get('/analytics', getAnalytics);
router.get('/ai-insights', getAIInsights);

export default router;
