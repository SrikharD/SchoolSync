import { Router } from 'express';
import {
  markAttendance,
  markBulkAttendance,
  getStudentAttendance,
  getClassAttendance,
} from '../controllers/attendance.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/attendance:
 *   post:
 *     summary: Mark attendance for a single student
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 *       409:
 *         description: Attendance already marked for this student today
 */
router.post('/', authenticate, authorize('admin', 'teacher'), markAttendance);

/**
 * @swagger
 * /api/attendance/bulk:
 *   post:
 *     summary: Mark attendance for an entire class at once
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bulk attendance processed with per-student results
 */
router.post('/bulk', authenticate, authorize('admin', 'teacher'), markBulkAttendance);

/**
 * @swagger
 * /api/attendance/student/{studentId}:
 *   get:
 *     summary: Get attendance records for a specific student
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *         example: "2024-2025"
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         example: "2025-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         example: "2025-06-30"
 *     responses:
 *       200:
 *         description: Attendance records with summary stats
 */
router.get('/student/:studentId', authenticate, getStudentAttendance);

/**
 * @swagger
 * /api/attendance/class:
 *   get:
 *     summary: Get attendance for an entire class on a specific date
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: className
 *         schema:
 *           type: string
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         example: "2025-06-23"
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class attendance for the given date
 */
router.get('/class', authenticate, authorize('admin', 'teacher'), getClassAttendance);

export default router;