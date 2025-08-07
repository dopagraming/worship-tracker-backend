import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import logger from './config/logger.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import parentRoutes from './routes/parent.js';
import studentRoutes from './routes/student.js';
import { startCronJobs } from './cron/scheduler.js';
dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://ibadat-frontend.vercel.app',
    credentials: true
}));

app.use(compression());

app.use(helmet());



app.use(
    '/api-docs',
    (req, res, next) => {
        const _q = { ...req.query };
        Object.defineProperty(req, 'query', {
            get() { return _q; },
            set(obj) { Object.assign(_q, obj); },
            configurable: true
        });
        next();
    },
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }
});
app.use('/api', apiLimiter);

app.use(express.json());

app.use(/^\/api\//, mongoSanitize());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/student', studentRoutes);

app.get('/', (req, res) => {
    res.send('API is running');
});

app.use((req, res, next) => {
    const err = new Error(`Not Found – ${req.originalUrl}`);
    err.statusCode = 404;
    next(err);
});

app.use(errorHandler);

process.on('uncaughtException', err => {
    logger.error(`Uncaught Exception: ${err.message}`);
    logger.error(err.stack);
    process.exit(1);
});

let server;
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    if (server) server.close(() => process.exit(1));
});

connectDB();
const PORT = process.env.PORT || 5000;
server = app.listen(PORT, () => {
    logger.info(` Server running on port ${PORT}`);
});