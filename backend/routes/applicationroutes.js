import express from 'express';
import { protect, authorize } from '../middleware/authmiddleware.js';
import { 
  applyForJob, getApplications, updateApplicationStatus, getApplicationStats 
} from '../controllers/applicationcontroller.js';

const router = express.Router();

router.post('/', protect, applyForJob);
router.get('/', protect, getApplications);
router.get('/stats', protect, authorize('recruiter', 'admin'), getApplicationStats);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

export default router;
