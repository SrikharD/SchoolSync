import { Router } from 'express';
import { register, login, getMe, getAllUsers } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// public routes - no token needed
router.post('/register', register);
router.post('/login', login);

// protected routes - token required
router.get('/me', authenticate, getMe);

// Admin only route - must be logged in AND have admin role
router.get('/users', authenticate, authorize('admin'), getAllUsers);

export default router;