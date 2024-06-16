import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(__dirname, `../../database/users.json`);

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const getUsers = async (): Promise<User[]> => {
    try {
        const users = fs.readFileSync(USERS_FILE, 'utf-8');
        return JSON.parse(users);
    } catch (error) {
        return [];
    }
}

export const saveUsers = async (users: User[]): Promise<void> => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
