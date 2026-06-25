export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'librarian' | 'accountant';

export interface JwtPayload {
    userId: number;
    email: string;
    role: UserRole;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord{
    studentId: number;
    date: string;
    status: AttendanceStatus;
    markedByUserId: number;
    academicYear: string;
    className: string;
    section: string;
    remarks?: string;
}