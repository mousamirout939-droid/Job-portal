import express from 'express';
import { protect, authorize } from '../middleware/authmiddleware.js';
import { 
  scoreApplications, getTopCandidates, getATSAnalytics, filterCandidates 
} from '../controllers/atscontroller.js';

const router = express.Router();

router.post('/:jobId/score', protect, authorize('recruiter', 'admin'), scoreApplications);
router.get('/:jobId/top-candidates/:limit', protect, authorize('recruiter', 'admin'), getTopCandidates);
router.get('/analytics', protect, authorize('recruiter', 'admin'), getATSAnalytics);
router.post('/filter', protect, authorize('recruiter', 'admin'), filterCandidates);

export default router;
