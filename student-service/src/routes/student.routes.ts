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

/*
// All routes require a valid JWT token, no public routes.
router.post('/', authenticate, authorize('admin', 'teacher'), createStudent);
router.get('/', authenticate, authorize('admin', 'teacher'), getAllStudents);
router.get('/class', authenticate, authorize('admin', 'teacher'), getStudentsByClass);
router.get('/:id', authenticate, getStudentById);
router.put('/:id', authenticate, authorize('admin', 'teacher'), updateStudent);
router.delete('/:id', authenticate, authorize('admin', 'teacher'), deactivateStudent);

export default router;
*/

/**
 * @swagger
 * /api/students:
 *    post:
 *      summary: Create a new student record
 *      tags: [Students]
 *      security:
 *          -bearerAuth: []
 *      requestBody:
 *           required: true
 *           content:
 *              application/son:
 *                  schema:
 *                    $ref: #/components/schemas/CreateStudentRequest'
 *      responses:
 *         201: 
 *          description: Student created successfully.
 *         406:
 *          description: Roll number already exists in this class/section!
 *         403:
 *          description: Access denied - admin or teacher role required!
 * 
 */
router.post('/', authenticate, authorize('admin', 'teacher'), createStudent);

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all students
 *       403:
 *         description: Access denied — admin or teacher role required
 */
router.get('/', authenticate, authorize('admin', 'teacher'), getAllStudents);

/**
 * @swagger
 * /api/students/class:
 *   get:
 *     summary: Get students filtered by class and section
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: className
 *         schema:
 *           type: string
 *         example: 10th Grade
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *         example: A
 *     responses:
 *       200:
 *         description: List of students in the given class/section
 */
router.get('/class', authenticate, authorize('admin', 'teacher'), getStudentsByClass);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a single student by ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student found
 *       404:
 *         description: Student not found
 */
router.get('/:id', authenticate, getStudentById);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student record
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentRequest'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 */
router.put('/:id', authenticate, authorize('admin', 'teacher'), updateStudent);

/**
 * @swagger
 * /api/students/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a student (soft delete)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student deactivated successfully
 *       404:
 *         description: Student not found
 *       403:
 *         description: Access denied — admin role required
 */
router.patch('/:id/deactivate', authenticate, authorize('admin'), deactivateStudent);

export default router;