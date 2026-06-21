export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'librarian' | 'accountant';

export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
}