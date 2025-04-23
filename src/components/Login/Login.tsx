import React, { useState, useEffect } from 'react';
import styles from './Login.module.css';
import { User } from '../../models/User';
import { useNavigate } from 'react-router-dom';
import { logInUser } from '../../service/userService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in both email and password.');
      return;
    }

    try {
      const response = await logInUser(email, password);
      console.log('Login response:', response);
      const user: User = response.user;
      localStorage.setItem('token', response.token); // Guarda el token en localStorage
      navigate('/home', { state: { user } });
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  useEffect(() => {
    const handleGoogleLoginMessage = (event: MessageEvent) => {
      if (event.origin !== 'http://localhost:4000') return;

      if (event.data.token) {
        const user: User = event.data.user;
        localStorage.setItem('token', event.data.token);
        if (event.data.user) {
          navigate('/home', { state: { user } });
        }
        
      }
    };

    window.addEventListener('message', handleGoogleLoginMessage);

    return () => {
      window.removeEventListener('message', handleGoogleLoginMessage);
    };
  }, [navigate]);

  const loginWithGoogle = () => {
    const googleAuthUrl = 'http://localhost:4000/api/users/auth/google';
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const googleAuthWindow = window.open(
      googleAuthUrl,
      'googleAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );


  };

        return (
      <div className={styles.loginContainer}>
        <div className={styles.logoContainer}>
          <img src="https://blogger.googleusercontent.com/img/a/AVvXsEgWpqjKdXXYRKEm6V4cXxGYQlTlB3HUEA9PB63z4rMjjlgtbpazYgTQ-jTypEBoXdTTC_wQ60CI3A1yW-H9j6yU576uys39eJMsX0os-jBDwz2ar334II6kn_8l4-79GZbe33VVoLp68xqypqTVxMm1txFhEmhEwyOFYZY4TZESOZoEAyvKplVruuyoZCVl" alt="Logo" className={styles.logo} />
        </div>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Login</h1>
          <form className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
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
            <button type="button" className={styles.button} onClick={handleLogin}>
              Login
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.googleLoginBtn}`}
              onClick={loginWithGoogle}
            >
              Login with Google
            </button>
          </form>
        </div>
      </div>
    );
};

export default Login;