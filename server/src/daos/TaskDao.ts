import mongoose, {Schema, Document} from 'mongoose';
import {Task} from '../models/Task';

export interface TaskModel extends Task, Document {};

const TaskSchema = new Schema(
    {
        owner: {type: String, required: true},
        title: {type: String, required: true},
        description: {type: String, required: false},
        date: {type: String, required: true},
    },
    {
        timestamps: true,versionKey: false
    }
);

export default mongoose.model<TaskModel>('Task', TaskSchema);