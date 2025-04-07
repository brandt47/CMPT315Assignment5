export type User = {
    _id: string;
    type: 'ADMIN' | 'USER';
    firstName: string;
    lastName: string;
    email:string;
}