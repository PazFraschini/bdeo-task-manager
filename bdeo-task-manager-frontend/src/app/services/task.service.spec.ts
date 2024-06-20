import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Ensure that the TaskService instance is created
  });

  it('should fetch tasks from API', () => {
    const mockTasks: Task[] = [
      { _id: '1', title: 'Task 1', description: 'Description 1', status: 'to-do' },
      { _id: '2', title: 'Task 2', description: 'Description 2', status: 'in-progress' }
    ];

    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2); // Ensure that the correct number of tasks is returned
      expect(tasks).toEqual(mockTasks); // Ensure that the returned tasks match the expected mockTasks
    });

    const req = httpMock.expectOne('http://localhost:3000/api/tasks'); // Expect a single HTTP request to this URL
    expect(req.request.method).toBe('GET'); 
    req.flush(mockTasks); // Provide mock data as the response to the HTTP request
  });

  it('should update a task via API', () => {
    const updatedTask: Task = { _id: '1', title: 'Updated Task 1', description: 'Updated Description 1', status: 'done' };

    service.updateTask('1', updatedTask).subscribe(response => {
      expect(response).toEqual(updatedTask); // Ensure that the updated task matches the expected updatedTask
    });

    const req = httpMock.expectOne('http://localhost:3000/api/tasks/1'); 
    expect(req.request.method).toBe('PUT'); 
    req.flush(updatedTask); // Provide mock data as the response to the HTTP request
  });

  it('should delete a task via API', () => {
    service.deleteTask('1').subscribe(response => {
      expect(response).toBeNull(); // Ensure that the response from deleting a task is null (or as expected)
    });

    const req = httpMock.expectOne('http://localhost:3000/api/tasks/1'); 
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Provide mock data as the response to the HTTP request
  });

  afterEach(() => {
    httpMock.verify(); // Verify that there are no outstanding HTTP requests after each test
  });
});
