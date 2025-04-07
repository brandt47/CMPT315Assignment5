export interface IUser {
    type: 'ADMIN' | 'USER';
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    }