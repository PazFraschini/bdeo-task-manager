import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { CommonModule } from '@angular/common'; 
import { MatMenuModule } from '@angular/material/menu'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../new-task/new-task.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,  
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule] 
})
export class TaskListComponent implements OnInit {
  // Arrays to hold tasks in status
  tasksToDo: Task[] = []; 
  tasksInProgress: Task[] = [];  
  tasksComplete: Task[] = []; 

  constructor(private taskService: TaskService, private dialog: MatDialog) {} 

  ngOnInit(): void {
    this.getTasks(); 
  }

  // Fetch tasks from the service and categorize them into different arrays based on status
  getTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasksToDo = tasks.filter(task => task.status === 'to-do');
      this.tasksInProgress = tasks.filter(task => task.status === 'in-progress');
      this.tasksComplete = tasks.filter(task => task.status === 'done');
    });
  }

  // Delete a task by its ID
  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        // Remove the deleted task from the corresponding arrays
        this.tasksToDo = this.tasksToDo.filter(task => task._id !== taskId);
        this.tasksInProgress = this.tasksInProgress.filter(task => task._id !== taskId);
        this.tasksComplete = this.tasksComplete.filter(task => task._id !== taskId);
      },
      error => {
        console.error('Error deleting task:', error);  // Log error if task deletion fails
      }
    );
  }

  // Open a modal to display task details
  openTaskDetailsModal(taskId: string): void {
    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '500px',
      data: { taskId } 
    });

    dialogRef.afterClosed().subscribe((updatedTask: Task) => {
      if (updatedTask) {
        this.updateTaskInColumn(updatedTask);  // Update task details in respective column
      } else {
        this.getTasks(); // Refresh the task list if a task was deleted
      }
    });
  }

  // Open a modal to add a new task
  openNewTaskModal(): void {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: '500px',
      data: {} 
    });

    dialogRef.afterClosed().subscribe((newTask: Task) => {
      if (newTask) {
        this.addTaskToColumn(newTask);  // Add new task to respective column
      }
    });
  }

  // Add a new task to the respective column based on its status
  addTaskToColumn(task: Task): void {
    switch (task.status) {
      case 'to-do':
        this.tasksToDo.push(task);
        break;
      case 'in-progress':
        this.tasksInProgress.push(task);
        break;
      case 'done':
        this.tasksComplete.push(task);
        break;
    }
  }

  // Update an existing task in the respective column
  updateTaskInColumn(updatedTask: Task): void {
    // Remove the updated task from all arrays and add it back with the updated details
    this.tasksToDo = this.tasksToDo.filter(task => task._id !== updatedTask._id);
    this.tasksInProgress = this.tasksInProgress.filter(task => task._id !== updatedTask._id);
    this.tasksComplete = this.tasksComplete.filter(task => task._id !== updatedTask._id);

    this.addTaskToColumn(updatedTask);
  }

  // Return CSS class based on task status for displaying card color
  getCardColorClass(status: string): string {
    switch (status) {
      case 'to-do':
        return 'bg-red';  
      case 'in-progress':
        return 'bg-yellow'; 
      case 'done':
        return 'bg-green'; 
      default:
        return '';  
    }
  }

}
