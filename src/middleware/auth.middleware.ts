import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {JwtPayload, UserRole} from '../types';

// Extending the express Request to carry the user payload.

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

// Verifies the JWT token on every protected route
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Checks if the authenticated user has the required role
export const authorize = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Access Denied:Insufficient permissions' });
            return;
        }

        next();
    }
}