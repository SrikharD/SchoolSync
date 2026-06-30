import { Request, Response } from 'express';
import { Attendance } from '../entities/Attendance';
import { publishEvent } from '../kafka/producer';
import axios from 'axios';

const STUDENT_SERVICE_URL = process.env.STUDENT_SERVICE_URL || 'http://localhost:3002';

// Verify the student exists in Student Service before
// marking attendance — same inter-service pattern as before
const verifyStudentExists = async (studentId: number, token: string) => {
  try {
    const response = await axios.get(`${STUDENT_SERVICE_URL}/api/students/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.student;
  } catch {
    return null;
  }
};

// Mark attendance for a single student
export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, date, status, academicYear, className, section, remarks } = req.body;
    const token = req.headers.authorization!.split(' ')[1];

    // Verify student exists across service boundary
    const student = await verifyStudentExists(studentId, token);
    if (!student) {
      res.status(404).json({ message: `Student ${studentId} not found` });
      return;
    }

    const attendance = await Attendance.create({
      studentId,
      date,
      status,
      markedByUserId: req.user!.userId,
      academicYear,
      className,
      section,
      remarks,
    });

    // Publish event to Kafka AFTER successful DB write.
    // If Kafka is down, the attendance is still saved —
    // the event is best-effort for now. In production you'd
    // use an outbox pattern to guarantee delivery.
    await publishEvent('attendance.marked', {
      studentId,
      date,
      status,
      markedByUserId: req.user!.userId,
      academicYear,
      className,
      section,
    });

    res.status(201).json({ message: 'Attendance marked successfully', attendance });
  } catch (error: any) {
    // Mongoose duplicate key error code is 11000
    if (error.code === 11000) {
      res.status(409).json({ message: 'Attendance already marked for this student on this date' });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark attendance for an entire class in one request —
// teacher submits an array, we process each student
export const markBulkAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { records, academicYear, className, section, date } = req.body;
    // records = [{ studentId: 42, status: 'present' }, { studentId: 43, status: 'absent' }, ...]

    const token = req.headers.authorization!.split(' ')[1];
    const results: { studentId: number; result: string }[] = [];

    for (const record of records) {
      try {
        await Attendance.create({
          studentId: record.studentId,
          date,
          status: record.status,
          markedByUserId: req.user!.userId,
          academicYear,
          className,
          section,
          remarks: record.remarks,
        });

        // Publish individual event per student
        await publishEvent('attendance.marked', {
          studentId: record.studentId,
          date,
          status: record.status,
          markedByUserId: req.user!.userId,
          academicYear,
          className,
          section,
        });

        results.push({ studentId: record.studentId, result: 'success' });
      } catch (error: any) {
        // Don't fail the whole batch if one student already has attendance
        results.push({
          studentId: record.studentId,
          result: error.code === 11000 ? 'already marked' : 'failed',
        });
      }
    }

    res.status(200).json({
      message: 'Bulk attendance processed',
      results,
      total: records.length,
      successful: results.filter(r => r.result === 'success').length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get attendance for a specific student
export const getStudentAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const { academicYear, startDate, endDate } = req.query;

    
    const filter: Record<string, unknown> = {
        studentId: Number(studentId),
    };

    if (academicYear) filter.academicYear = String(academicYear);
    if (startDate && endDate) {
        filter.date = { $gte: String(startDate), $lte: String(endDate) };
    }

    const records = await Attendance.find(filter).sort({ date: -1 });

    // Calculate summary stats
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent  = records.filter(r => r.status === 'absent').length;
    const late    = records.filter(r => r.status === 'late').length;

    res.status(200).json({
      records,
      summary: {
        total,
        present,
        absent,
        late,
        attendancePercentage: total > 0 ? ((present / total) * 100).toFixed(1) : '0',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get attendance for an entire class on a specific date
export const getClassAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { className, section, date, academicYear } = req.query;

    const filter: Record<string, unknown> = {};

    if (className)    filter.className    = String(className);
    if (section)      filter.section      = String(section);
    if (date)         filter.date         = String(date);
    if (academicYear) filter.academicYear = String(academicYear);

    const records = await Attendance.find(filter);

    res.status(200).json({ records, total: records.length });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};