import { Router } from 'express';
import { 
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentsByClass,
    updateStudent,
    deactivateStudent
} from '../controllers/student.controller';
import { authenticate, authorize } from '../middleware/student.middleware';

const router = Router();

// All routes require a valid JWT token, no public routes.
router.post('/', authenticate, authorize('admin', 'teacher'), createStudent);
router.get('/', authenticate, authorize('admin', 'teacher'), getAllStudents);
router.get('/class', authenticate, authorize('admin', 'teacher'), getStudentsByClass);
router.get('/:id', authenticate, getStudentById);
router.put('/:id', authenticate, authorize('admin', 'teacher'), updateStudent);
router.delete('/:id', authenticate, authorize('admin', 'teacher'), deactivateStudent);

export default router;
