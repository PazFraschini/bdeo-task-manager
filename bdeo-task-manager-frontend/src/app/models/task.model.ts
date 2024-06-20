export interface Task {
    _id?: string; //MongoDB automatically generates an ID
    title: string;
    description: string;
    status: 'to-do' | 'in-progress' | 'done';
}
