import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { createTask, deleteTask, getAllTasks, updateTask } from '../services/TaskService';
import { get } from 'http';

class TaskController {
    // Get all tasks
    public async getAllTasks(req: Request, res: Response): Promise<void> {
        try {
            const owner = req.query.owner as string; // Use query parameters instead of req.body
            if (!owner) {
                res.status(400).json({ error: 'Owner ID is required' });
                return;
            }
    
            const tasks = await getAllTasks(owner);
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error', details: error });
        }
    }

    // Create a new task
    public async createTask(req: Request, res: Response): Promise<void> {
        try {
            const newTask = req.body;
            await createTask(newTask);
            res.status(201).json(newTask);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Update an existing task
    public async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const updatedTask = await updateTask(req.params.id, req.body);
            if (!updatedTask) {
                res.status(404).json({ error: 'Task not found' });
            }
            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body; // Use body instead of params
            if (!id) {
                res.status(400).json({ error: "Task ID is required" });
                return;
            }
    
            const deletedTask = await deleteTask(id); // Call service function
            if (!deletedTask) {
                res.status(404).json({ error: "Task not found" });
                return;
            }
    
            res.status(200).json({ message: "Task deleted successfully" });
        } catch (error) {
            console.error("Error deleting task:", error);
            res.status(500).json({ error: "Internal Server Error", details: error });
        }
    }
}

export default new TaskController();