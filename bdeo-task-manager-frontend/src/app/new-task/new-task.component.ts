import { Component, Inject, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { Router } from '@angular/router'; 
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-new-task', 
  templateUrl: './new-task.component.html', 
  styleUrls: ['./new-task.component.scss'], 
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIcon] 
})
export class NewTaskComponent implements OnInit {
  taskForm: FormGroup; 
  isModal: boolean; 

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private taskService: TaskService,
    public dialogRef: MatDialogRef<NewTaskComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    // Initialize taskForm with form controls and validators
    this.taskForm = this.fb.group({
      title: ['', Validators.required],  
      description: ['', Validators.required],  
      status: ['', Validators.required] 
    });

    this.isModal = !!data; // Check if the component is used as a modal
  }

  ngOnInit(): void {}

// Creates a new task
  onSubmit(): void {
    if (this.taskForm.valid) {  // Check if form is valid
      this.taskService.createTask(this.taskForm.value).subscribe( 
        createdTask => {
          console.log('Task created successfully:', createdTask); 
          if (this.isModal) {
            this.dialogRef.close(createdTask); 
          } else {
            this.router.navigate(['/tasks']); 
          }
        },
        error => {
          console.error('Error creating task:', error);  // Log error message
        }
      );
    } else {
      this.taskForm.markAllAsTouched();  // Mark all form controls as touched to show validation errors
      console.error('Form is invalid');  // Log error if form is invalid
    }
  }

  close(): void {
    this.dialogRef.close(); 
  }
}
