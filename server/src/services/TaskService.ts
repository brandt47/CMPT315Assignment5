import TaskDao from '../daos/TaskDao';
import { Task } from '../models/Task';


export async function getAllTasks(owner: String): Promise<Task[]> {
    return await TaskDao.find({ owner });
}

export async function createTask(taskData: Partial<Task>): Promise<Task> {
    const task = new TaskDao(taskData);
    return await task.save();
}

export async function updateTask(id: string, taskData: Partial<Task>): Promise<Task | undefined> {
    const task = await TaskDao.findById(id);
    if (!task) {
        return undefined;
    }
    Object.assign(task, taskData);
    return await task.save();
}

export const deleteTask = async (id: string) => {
    return await TaskDao.findByIdAndDelete(id); // Ensure this properly deletes the task
};
