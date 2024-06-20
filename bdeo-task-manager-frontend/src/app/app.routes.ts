import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { TaskDetailsComponent } from './task-details/task-details.component';

export const routes: Routes = [
    { path: '', redirectTo: '/tasks', pathMatch: 'full' }, 
    { path: 'tasks', component: TaskListComponent },
    { path: 'new-task', component: NewTaskComponent },
    { path: 'tasks/:_id', component: TaskDetailsComponent }
];
