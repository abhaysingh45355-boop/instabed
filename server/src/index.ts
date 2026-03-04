import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

const server = http.createServer(app);

// WebSocket Setup
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start Server
const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Successfully connected to Database');

        server.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully.');
    await prisma.$disconnect();
    server.close(() => {
        console.log('Process terminated.');
    });
});

export { io, prisma };
