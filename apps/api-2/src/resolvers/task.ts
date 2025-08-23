import { Context } from '../types';

let taskIdCounter = 1;
const tasks: { id: string; text: string }[] = [];

export const taskResolvers = {
  tasks: async (_parent: any, _args: any, _context: Context) => {
    return tasks;
  },

  createTask: async (_parent: any, args: { text: string }, _context: Context) => {
    const newTask = {
      id: taskIdCounter.toString(),
      text: args.text,
    };
    
    tasks.push(newTask);
    taskIdCounter++;
    
    return newTask;
  },
};