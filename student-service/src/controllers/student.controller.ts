import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Student } from '../entities/Student';

const studentRepo = () => AppDataSource.getRepository(Student);

// Admin/Teacher creates a student record
export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, firstName, lastName, rollNumber, className, section, dateOfBirth, parentUserId } = req.body;

    const existing = await studentRepo().findOne({ where: { rollNumber, className, section } });
    if (existing) {
      res.status(409).json({ message: 'Roll number already exists in this class/section' });
      return;
    }

    const student = studentRepo().create({
      userId,
      firstName,
      lastName,
      rollNumber,
      className,
      section,
      dateOfBirth,
      parentUserId,
    });

    await studentRepo().save(student);

    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all students only for Admin/Teacher 
export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await studentRepo().find();
    res.status(200).json({ students, total: students.length });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single student by ID
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const student = await studentRepo().findOne({ where: { id: Number(req.params.id) } });

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get students by class and section, useful for teachers viewing their class roster
export const getStudentsByClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { className, section } = req.query;

    const students = await studentRepo().find({
      where: {
        className: className as string,
        section: section as string,
      },
    });

    res.status(200).json({ students, total: students.length });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update student details, Admin/Teacher only
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const student = await studentRepo().findOne({ where: { id: Number(req.params.id) } });

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    studentRepo().merge(student, req.body);
    await studentRepo().save(student);

    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Soft delete, sets isActive to false instead of removing the row.
// This preserves historical records (attendance, grades) that reference this student.
export const deactivateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const student = await studentRepo().findOne({ where: { id: Number(req.params.id) } });

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    student.isActive = false;
    await studentRepo().save(student);

    res.status(200).json({ message: 'Student deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};