import express from 'express';
import { protect, authorize } from '../middleware/authmiddleware.js';
import { 
  createJob, getJobs, getJobById, updateJob, deleteJob, getRecruiterJobs 
} from '../controllers/jobcontroller.js';

const router = express.Router();

router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.get('/', getJobs);
router.get('/recruiter/jobs', protect, authorize('recruiter', 'admin'), getRecruiterJobs);
router.get('/:id', getJobById);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

export default router;
