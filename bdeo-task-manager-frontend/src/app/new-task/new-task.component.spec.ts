import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTaskComponent } from './new-task.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../services/task.service';
import { of } from 'rxjs';
import { Task } from '../models/task.model';

describe('NewTaskComponent', () => {
  let component: NewTaskComponent;
  let fixture: ComponentFixture<NewTaskComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    const taskServiceMock = jasmine.createSpyObj('TaskService', ['createTask']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceMock }, 
        { provide: MatDialogRef, useValue: mockDialogRef }, 
        { provide: MAT_DIALOG_DATA, useValue: { taskId: '1' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewTaskComponent);
    component = fixture.componentInstance; // Initialize the component under test
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>; 
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Ensure that component is created successfully
  });

  it('should create a new task', () => {
    const newTask: Task = {
      title: 'New Task',
      description: 'New Description',
      status: 'to-do'
    };

    taskServiceSpy.createTask.and.returnValue(of(newTask)); // Mock the createTask method of TaskService

    component.taskForm.setValue(newTask); // Set the form value to simulate user input

    component.onSubmit(); // Trigger the onSubmit method

    // Verify that createTask was called with the new task object
    expect(taskServiceSpy.createTask).toHaveBeenCalledWith(newTask);

    // Verify that mockDialogRef.close was called with the new task object
    expect(mockDialogRef.close).toHaveBeenCalledWith(newTask);
  });

});
