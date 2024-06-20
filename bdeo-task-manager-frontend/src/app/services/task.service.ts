import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 
import { Task } from '../models/task.model'; 

@Injectable({
    providedIn: 'root' 
})
export class TaskService {
    private apiUrl = 'http://localhost:3000/api/tasks';  // Base API URL for tasks

    constructor(private http: HttpClient) {} 

    // Method to fetch all tasks
    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl); 
    }

    // Method to fetch a task by ID
    getTaskById(taskId: string): Observable<Task> {
        const url = `${this.apiUrl}/${taskId}`; 
        return this.http.get<Task>(url);  
    }
    
    // Method to create a new task
    createTask(task: Task): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, task);
    }

    // Method to update an existing task
    updateTask(taskId: string, task: Task): Observable<Task> {
        const url = `${this.apiUrl}/${taskId}`;  
        return this.http.put<Task>(url, task); 
    }

    // Method to delete a task by ID
    deleteTask(taskId: string): Observable<any> {
        const url = `${this.apiUrl}/${taskId}`; 
        return this.http.delete(url); 
    }
}
