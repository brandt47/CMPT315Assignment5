import TimerDao from '../daos/TimerDao';
import { TimerObj } from '../models/TimerObj';


export async function getAllTimers(owner: String): Promise<TimerObj[]> {
    return TimerDao.find({owner});
}

export async function createTimer(timerData: Partial<TimerObj>): Promise<TimerObj> {
    const timer = new TimerDao(timerData);
    return await timer.save();
}

export async function updateTimer(id: string, timerData: Partial<TimerObj>): Promise<TimerObj | undefined> {
    const timer = await TimerDao.findById(id);
    if (!timer) {
        return undefined;
    }
    Object.assign(timer, timerData);
    return await timer.save();
}

export async function deleteTimer(id: string): Promise<boolean> {
    const result = await TimerDao.findByIdAndDelete(id);
    return result !== null;
}
