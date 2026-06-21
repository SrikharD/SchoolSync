import { Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { UserRole } from '../types';

const userRepo = () => AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        // Check if user already exists
        const existing = await userRepo().findOne({ where: { email } });
        if (existing) {
            res.status(409).json({ message: 'Email already registered!' });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = userRepo().create({
            email: email.toLowerCase(),
            password: hashedPassword,
            firstName,
            lastName,
            role: role as UserRole || 'student',
        });

        await userRepo().save(user);

        res.status(201).json({
            message: 'User registered successfully!',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await userRepo().findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
            res.status(404).json({ message: 'Invalid Credentials' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
              { userId: user.id, email: user.email, role: user.role },
              process.env.JWT_SECRET! as string,
              { expiresIn: process.env.JWT_EXPIRES_IN as any || '7d' }
            );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userRepo().findOne({ 
            where: { id: req.user!.userId },
            select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true},
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userRepo().find({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true },
    });

    res.status(200).json({ users, total: users.length });
    
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserById = async(req: Request, res: Response): Promise<void> => {
    try{
        const user = await userRepo().findOne({
            where: { id: Number(req.params.id) },
            select: {id: true, email:true, firstName:true, lastName:true, role:true, isActive:true},
        });

        if(!user){
            res.status(404).json({message: 'User not found.'});
            return;
        }

        res.status(200).json({ user });

    } catch(error) {
        res.status(500).json({ message: 'Internal Server Error. '});
    }

};