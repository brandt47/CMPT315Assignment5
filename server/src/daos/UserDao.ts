import mongoose, {Schema, Document} from 'mongoose';
import {IUser} from '../models/User';

export interface IUserModel extends IUser, Document {};

const UserSchema = new Schema(
    {
        type: {type: String, required: true}, //this is a mongoose string hence the capital S
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
    },
    {
        timestamps: true,versionKey: false
    }
);

export default mongoose.model<IUserModel>('User', UserSchema);