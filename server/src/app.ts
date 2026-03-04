import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

import hospitalRoutes from './routes/hospitalRoutes';

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/v1/hospitals', hospitalRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// API Routes Placeholder
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/beds', bedRoutes);
// app.use('/api/v1/inventory', inventoryRoutes);
// app.use('/api/v1/ai', aiRoutes);

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

export default app;
