export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'librarian' | 'accountant';

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    mustChangePassword?: boolean;
}

export interface Student {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    rollNumber: string;
    className: string;
    section: string;
    dateOfBirth: string;
    isActive: boolean;
}

export interface AttendanceRecord {
    _id: string;
    studentId: number;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    markedByUserId: number;
    academicYear: string;
    className: string;
    section: string;
}

export interface AttendanceSummary {
    total: number;
    present: number;
    absent: number;
    late: number;
    AttendancePercent: string;
}

export interface LoginResponse {
    token: string;
    User: User;
}