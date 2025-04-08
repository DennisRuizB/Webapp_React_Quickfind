import React, { useState } from 'react';
import styles from './Login.module.css';
import { User } from '../../models/User';
import { useNavigate } from 'react-router-dom';
import { homedir } from 'os';
import { LogIn } from '../../service/userService';


const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        // Asegúrate de que email y password no sean cadenas vacías
        if (!email || !password) {
            alert('Please fill in both email and password.');
            return;
        }else{
            try {
                const user = await LogIn(email, password);
                console.log('User logged in:', user);
                navigate('/home', { state: { user } });
            } catch (error) {
                console.error('Login failed:', error);
                alert('Login failed. Please check your credentials.');
            }

        }
    };

    return (
        <div className={styles.loginContainer}>
            <h1>Login</h1>
            <form className={styles.loginForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="button" className={styles.button} onClick={()=>handleLogin()} >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;