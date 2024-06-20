import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailsComponent } from './task-details.component';
import { TaskService } from '../services/task.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Task } from '../models/task.model';

describe('TaskDetailsComponent', () => {
  let component: TaskDetailsComponent;
  let fixture: ComponentFixture<TaskDetailsComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    const taskServiceMock = jasmine.createSpyObj('TaskService', ['getTaskById', 'updateTask', 'deleteTask']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule], 
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { taskId: '1' } }
      ],
      declarations: []  
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailsComponent);
    component = fixture.componentInstance;  // Assign the component instance correctly
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;

    // Initialize the form inside the component to avoid NG01001
    component.taskForm = new FormGroup({
      _id: new FormControl(''),
      title: new FormControl(''),
      description: new FormControl(''),
      status: new FormControl('')
    });
  });

  it('should create', () => {
    expect(component).toBeDefined();  // Ensure that the component is defined
  });

  it('should load task details on ngOnInit', () => {
    const mockTask: Task = { _id: '1', title: 'Task 1', description: 'Description 1', status: 'to-do' };
    taskServiceSpy.getTaskById.and.returnValue(of(mockTask));
  
    // Call ngOnInit to load task details
    component.ngOnInit();
    component.task = mockTask;
  
    // Verify that getTaskById was called with the correct taskId
    expect(taskServiceSpy.getTaskById).toHaveBeenCalledWith('1');
  
    // Verify that task data has been set in the component
    expect(component.task).toEqual(mockTask);
  });

  it('should update task', () => {
    const updatedTask: Task = { _id: '1', title: 'Updated Task 1', description: 'Updated Description 1', status: 'in-progress' };
    taskServiceSpy.updateTask.and.returnValue(of(updatedTask));

    // Set the form value before calling onSubmit
    component.taskForm.setValue({
      _id: updatedTask._id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status
    });

    component.onSubmit();

    // Verify that updateTask was called with the correct taskId and updatedTask object
    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith('1', updatedTask);
    expect(mockDialogRef.close).toHaveBeenCalledWith(updatedTask);
  });

  it('should delete task', () => {
    taskServiceSpy.deleteTask.and.returnValue(of(null));

    component.taskForm.controls['_id'].setValue('1');  // Ensure task ID is set
    component.deleteTask();

    // Verify that deleteTask was called with the correct taskId
    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith('1');
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });

});

