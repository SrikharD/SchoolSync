import { Request, Response, NextFunction } from 'express';
import  jwt  from 'jsonwebtoken';
import { JwtPayload, UserRole } from '../types';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

// Student Service does NOT issue tokens, it only verfies that are issued 
// by Auth Service. So we only need the authenticate middleware here, not authorize.
// This works because both services share the same JWT_SECRET, so jwt.Verify() here succeeds on a token signed by Auth Service.

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

export const authorize = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if(!roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Access Denied: Insufficient permissions' });
            return;
        }
        next();
    };
};