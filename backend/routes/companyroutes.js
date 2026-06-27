import express from 'express';
import { protect, authorize } from '../middleware/authmiddleware.js';
import { 
  createCompany, getCompanies, getCompanyById, updateCompany, getMyCompany 
} from '../controllers/companycontroller.js';

const router = express.Router();

router.post('/', protect, authorize('recruiter', 'admin'), createCompany);
router.get('/', getCompanies);
router.get('/my-company', protect, getMyCompany);
router.get('/:id', getCompanyById);
router.put('/:id', protect, updateCompany);

export default router;
