import mongoose, { Schema, Document } from 'mongoose';
import { AttendanceStatus } from '../types';


// Document interface tells ts what shape a doc from this collection has,
// including mongoose's built-in fields like _id and timestamps
export interface IAttendance extends Document {
    studentId: number;
    date: string;
    status: AttendanceStatus;
    markedByUserId: number;
    academicYear: string;
    className: string;
    section: string;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}


const AttendanceSchema = new Schema<IAttendance>(
{
    studentId: { type: Number, required: true },
    date: { type: String, required: true},
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'excused'],
        required: true,
    },
    markedByUserId: { type: Number, required: true },
    academicYear: { type: String, required: true },
    className: { type: String, required: true },
    remarks: { type: String },
},
{
    timestamps: true,
}
);

// Compound index: prevents a teacher from marking the same student's attendance twice
// on the same day for the same class. MongoDB will reject a duplicate insert at the database level.
AttendanceSchema.index({ studentId: 1, date: 1}, { unique: true });

export const Attendance = mongoose.model<IAttendance>( 'Attendance', AttendanceSchema );