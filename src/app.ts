import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

//Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Auth Service' });
});

// Routes
app.use('/api/auth', authRoutes);

// Start the server after DB connection is established
AppDataSource.initialize()
    .then(() => {
        console.log('PostgreSQL connected successfully!');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to the PostgreSQL database:', error);
        process.exit(1);
    });