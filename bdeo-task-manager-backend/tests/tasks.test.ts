import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { Task } from '../src/models/task';


describe('Task Controller Tests', () => {
  let taskId: string;

  // Setup MongoDB connection before running tests
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/taskmanager_test'); // mongoURI for testing
  });
  
  // Cleanup after all tests have finished
  afterAll(async () => {
    await Task.deleteMany({});
    await mongoose.connection.close();
  });
  
  beforeEach(async () => {
    // Create task in db
    const taskData = {
      title: 'Test Task',
      description: 'Testing POST request',
      status: 'to-do',
    };
    const newTask = new Task(taskData);
    const savedTask = await newTask.save();
    taskId = savedTask._id.toString();
  });

  // Test for creating a new task
  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Testing POST request',
        status: 'to-do',
      };
      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .timeout({ response: 5000, deadline: 10000 }); // Timeout configuration

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(taskData);

      taskId = response.body._id; // Save the task ID for later use
    }, 15000); // Increase timeout for this test, since it may take longer

    it('should return 400 if title is missing', async () => {
      const taskData = {
        description: 'Testing POST request',
        status: 'to-do',
      };
      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .timeout({ response: 5000, deadline: 10000 }); // Timeout configuration

      expect(response.status).toBe(400);
    }, 15000); // Increase timeout for this test, since it may take longer
  });

// Test for getting all tasks
  describe('GET /api/tasks', () => {
    it('should get all tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .timeout({ response: 5000, deadline: 10000 }); // Timeout configuration

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle empty database', async () => {
      await Task.deleteMany({});

      const response = await request(app)
        .get('/api/tasks')
        .timeout({ response: 5000, deadline: 10000 }); // Timeout configuration

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });
  });

  // Test for getting a task by ID
  describe('GET /api/tasks/:id', () => {
    it('should get a task by ID', async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .timeout({ response: 5000, deadline: 10000 }); // Timeout configuration

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(taskId);
    });

    it('should return 404 for non-existent task ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/tasks/${nonExistentId}`)
        .timeout({ response: 5000, deadline: 10000 }); // Timeout configuration

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });
});

  // Test for updating a task by ID
  describe('PUT /api/tasks/:id', () => {
    it('should update a task by ID', async () => {
      const updatedTaskData = {
        title: 'Updated Task Title',
        description: 'Updated task description',
        status: 'in-progress',
      };
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updatedTaskData)
        .timeout({ response: 5000, deadline: 10000 }); // Timeout configuration

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updatedTaskData);
    });

    it('should return 404 for non-existent task ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updatedTaskData = {
        title: 'Updated Task Title',
        description: 'Updated task description',
        status: 'in-progress',
      };
      const response = await request(app)
        .put(`/api/tasks/${nonExistentId}`)
        .send(updatedTaskData)
        .timeout({ response: 5000, deadline: 10000 }); // Timeout configuration

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });

    it('should return 400 for invalid task ID format', async () => {
      const invalidId = 'invalid-id-format';
      const updatedTaskData = {
        title: 'Updated Task Title',
        description: 'Updated task description',
        status: 'in-progress',
      };
      const response = await request(app)
        .put(`/api/tasks/${invalidId}`)
        .send(updatedTaskData)
        .timeout({ response: 5000, deadline: 10000 }); // Timeout configuration

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid task ID format');
    });
  });

//   // Test for deleting a task by ID
  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task by ID', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .timeout({ response: 5000, deadline: 10000 }); // Timeout configuration

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
    });

    it('should return 404 for non-existent task ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/tasks/${nonExistentId}`)
        .timeout({ response: 5000, deadline: 10000 }); // Timeout configuration

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });

    it('should return 400 for invalid task ID format', async () => {
      const invalidId = 'invalid-id-format';
      const response = await request(app)
        .delete(`/api/tasks/${invalidId}`)
        .timeout({ response: 5000, deadline: 10000 }); // Timeout configuration

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid task ID format');
    });
  });
});
