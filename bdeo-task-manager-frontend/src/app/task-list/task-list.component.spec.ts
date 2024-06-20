import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Task } from '../models/task.model';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    const taskServiceMock = jasmine.createSpyObj('TaskService', ['getTasks', 'deleteTask']);

    // Configure the testing module
    await TestBed.configureTestingModule({
      imports: [TaskListComponent], 
      declarations: [],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: MatDialog, useValue: {} }
      ]
    }).compileComponents(); 

    // Create a component fixture and retrieve the component instance
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;

    // Inject the TaskService spy into the component
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
  });

  // Test case: should create
  it('should create', () => {
    expect(component).toBeTruthy(); // Assert that the component is created successfully
  });

  // Test case: should fetch tasks on ngOnInit
  it('should fetch tasks on ngOnInit', () => {
    // Define mock tasks
    const mockTasks: Task[] = [
      { _id: '1', title: 'Task 1', description: 'Description 1', status: 'to-do' },
      { _id: '2', title: 'Task 2', description: 'Description 2', status: 'in-progress' },
      { _id: '3', title: 'Task 3', description: 'Description 3', status: 'done' }
    ];

    // Set up TaskService spy to return observable of mockTasks
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));

    // Call ngOnInit to fetch tasks
    component.ngOnInit();

    // Assert that tasks have been categorized correctly
    expect(component.tasksToDo.length).toBe(1);
    expect(component.tasksInProgress.length).toBe(1);
    expect(component.tasksComplete.length).toBe(1);
  });

  // Test case: should delete task
  it('should delete task', () => {
    // Define taskId for deletion
    const taskId = '1';

    // Set up TaskService spy to return observable of null when deleteTask is called
    taskServiceSpy.deleteTask.and.returnValue(of(null));

    // Initialize tasksToDo with a mock task
    component.tasksToDo = [{ _id: taskId, title: 'Task 1', description: 'Description 1', status: 'to-do' }];
    component.deleteTask(taskId);
    
    // Assert that tasksToDo is now empty after deletion
    expect(component.tasksToDo.length).toBe(0);
    
    // Assert that deleteTask was called with the correct taskId
    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith(taskId);
  });

});
