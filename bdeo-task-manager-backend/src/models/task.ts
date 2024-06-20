import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['to-do', 'in-progress', 'done'], required: true }
});

export const Task = model('Task', taskSchema);
