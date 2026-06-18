import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import apiRouter from './routes/api.js';
import { errorHandler } from './middleware/error.middleware.js';

// Establish safe structural connection down to database layer
connectDB();

const app = express();

// Global Protection HTTP Security Modifiers
app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: false
}));

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173', // Vite default
    'http://localhost:3000',
    'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({ 
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json({ limit: '15kb' }));

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many server hits from this origin. Please try again later.' }
});
app.use('/api/', rateLimiter);

// Bind Modular API Endpoint Channels
app.use('/api/v1', apiRouter);

// Fallback Route Handler (404 Error handler)
app.use('*', (req, res, next) => {
    res.status(404).json({ status: 'fail', message: `Can't find ${req.originalUrl} on this server.` });
});

// Structural Exception Catcher Interface Line
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Production server executing gracefully on port: ${PORT}`);
});