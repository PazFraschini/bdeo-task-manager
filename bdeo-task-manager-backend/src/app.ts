import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import taskRoutes from './routes/task';

const app: Application = express();
const PORT: string | number = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

let mongoURI = 'mongodb://localhost:27017/taskmanager';  // URI for production or development
if (process.env.NODE_ENV === 'test') {
  mongoURI = 'mongodb://localhost:27017/taskmanager_test';  // URI for testing 
}

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Task Route
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app