import mongoose, {Schema, Document} from 'mongoose';
import {TimerObj} from '../models/TimerObj';

export interface TimerModel extends TimerObj, Document {}

const TimerSchema = new Schema(
    {
        owner: {type: String, required: true},
        timerName: {type: String, required: true},
        description: {type: String, required: false},
        duration: {type: String, required: true},
    },
    {
        timestamps: true,versionKey: false
    }
);

export default mongoose.model<TimerModel>('Timer', TimerSchema);