import { User } from "../models/User";
import axios from 'axios';

const apiURL = 'http://localhost:4000/api/users'

export const LogIn = async (email: string, password: string): Promise<User> => {
    try {
        const response = await axios.post<User>(`${apiURL}/login`, { email, password });
        if (response.status !== 200) {
            throw new Error('Failed to log in');
        }
        return response.data; // Devuelve los datos del usuario
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};