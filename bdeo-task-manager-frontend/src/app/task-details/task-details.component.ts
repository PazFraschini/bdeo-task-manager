import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIcon]
})
export class TaskDetailsComponent implements OnInit {
  taskForm: FormGroup;
  isModal: boolean;
  task!: Task;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taskForm = this.fb.group({
      _id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required]
    });

    this.isModal = !!data;
  }

  ngOnInit(): void {
    if (this.data && this.data.taskId) {
      this.loadTaskDetails(this.data.taskId);
    }
  }

  // Load details for edit view
  loadTaskDetails(taskId: string): void {
    this.taskService.getTaskById(taskId).subscribe(task => {
      this.taskForm.setValue({
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status
      });
    });
  }

  // Updates task from edit modal
  onSubmit(): void {
    if (this.taskForm.valid) {
      this.taskService.updateTask(this.taskForm.value._id, this.taskForm.value).subscribe(
        updatedTask => {
          console.log('Task updated successfully:', updatedTask);
          if (this.isModal) {
            this.dialogRef.close(updatedTask);
          } else {
            this.router.navigate(['/tasks']);
          }
        },
        error => {
          console.error('Error updating task:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  // Deletes task from modal
  deleteTask(): void {
    const taskId = this.taskForm.value._id;
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        console.log('Task deleted successfully');
        this.dialogRef.close(null);
      },
      error => {
        console.error('Error deleting task:', error);
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
