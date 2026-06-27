import express from 'express';
import { protect, authorize } from '../middleware/authmiddleware.js';
import { 
  getDashboard, getUsers, verifyCompany, getCompanies, suspendUser, getSystemReports 
} from '../controllers/admincontroller.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/companies', getCompanies);
router.post('/companies/:companyId/verify', verifyCompany);
router.post('/users/:userId/suspend', suspendUser);
router.get('/reports', getSystemReports);

export default router;
