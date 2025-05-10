import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB, { closeDatabase } from './config/db';
import { useMockDb } from './utils/mockDb';
import { seedAdminAccount } from './utils/seedAdmin';
import { seedDemoAccounts } from './utils/seedDemoAccounts';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import courseRoutes from './routes/courses';
import enrollmentRoutes from './routes/enrollments';
import assessmentRoutes from './routes/assessments';
import liveClassRoutes from './routes/liveClasses';
import notificationRoutes from './routes/notifications';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to MongoDB (will handle gracefully in development mode if DB not available)
connectDB().then(async () => {
  // Seed admin account if none exists
  await seedAdminAccount();
  
  // Seed demo accounts if enabled
  await seedDemoAccounts();
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Mock database middleware (only active if NODE_ENV=development and USE_MOCK_DB=true)
if (NODE_ENV === 'development') {
  process.env.USE_MOCK_DB = 'true';
  console.log('Development mode: Mock database is enabled');
  app.use(useMockDb);
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  const dbMode = (req as any).useMockDb ? 'Mock Database' : 'MongoDB';
  res.json({ 
    message: 'Knowledge Chakra API',
    environment: NODE_ENV,
    database: dbMode
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});

// Handle cleanup on app shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  await closeDatabase();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  await closeDatabase();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

export default app; 