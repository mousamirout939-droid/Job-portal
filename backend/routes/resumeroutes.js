import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import upload from '../middleware/uploadmiddleware.js';
import { 
  uploadResume, getResumes, setPrimaryResume, deleteResume 
} from '../controllers/resumecontroller.js';

const router = express.Router();

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getResumes);
router.put('/:id/primary', protect, setPrimaryResume);
router.delete('/:id', protect, deleteResume);

export default router;
