import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload, UserRole } from "../types";

declare global {
    namespace Express{
        interface Request{
            user?: JwtPayload;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

      console.log('AUTH HEADER RECEIVED:', authHeader); 

    if (!authHeader || !authHeader.startsWith('Bearer '))
        {
            res.status(401).json({message: 'No token provided.'});
            return;
        }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    }catch (error) {
         console.log('JWT VERIFY ERROR:', error);
        res.status(401).json({message: 'Inavlid or expired token.'});
    }
};

export const authorize = (...roles: UserRole[]) => {
    return(req: Request, res: Response, next: NextFunction): void => {
        if(!req.user){
            res.status(401).json({message: 'Not authorized.'});
            return;
        }

        if(!roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Access denied: insufficient permission. '});
            return;
        }

        next();
    };
};

