import express, { Router } from 'express';
import * as taskController from '../controllers/taskController';

const router: Router = express.Router();

// Create new task
router.post('/', taskController.createTask);

// Get all tasks
router.get('/', taskController.getAllTasks);

// Get task by Id
router.get('/:id', taskController.getTaskById);

// Update task
router.put('/:id', taskController.updateTask);

// Delete task
router.delete('/:id', taskController.deleteTask);

export default router;
