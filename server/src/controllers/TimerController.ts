import { Request, Response } from 'express';
import { TimerObj } from '../models/TimerObj';
import { createTimer, deleteTimer, getAllTimers, updateTimer } from '../services/TimerService';
import { get } from 'http';

class TimerController {
    // Get all timers
    public async getAllTimers(req: Request, res: Response): Promise<void> {
        try {
            const owner = req.body.owner as string;
            const timers = await getAllTimers(owner);
            res.status(200).json(timers);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Create a new timer
    public async createTimer(req: Request, res: Response): Promise<void> {
        try {
            const newTimer = req.body;
            await createTimer(newTimer);
            res.status(201).json(newTimer);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Update an existing timer
    public async updateTimer(req: Request, res: Response): Promise<void> {
        try {
            const updatedTimer = await updateTimer(req.params.id, req.body);
            if (!updatedTimer) {
                res.status(404).json({ error: 'Timer not found' });
            }
            res.status(200).json(updatedTimer);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Delete a timer
    public async deleteTimer(req: Request, res: Response): Promise<void> {
        try {
            const deletedTimer = await deleteTimer(req.params.id);
            if (!deletedTimer) {
                res.status(404).json({ error: 'Timer not found' });
            }
            res.status(200).json({ message: 'Timer deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new TimerController();