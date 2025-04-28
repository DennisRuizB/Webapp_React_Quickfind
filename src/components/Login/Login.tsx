
import React, { useState, useEffect } from 'react';
import styles from './Login.module.css';
import { User } from '../../models/User';
import { useNavigate } from 'react-router-dom';
import { logInUser, registerUser } from '../../service/userService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  // State to track if card is flipped (register view)
  const [isFlipped, setIsFlipped] = useState(false);


  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    try {
      const response = await logInUser(email, password);
      console.log("Login response:", response);
      const user: User = response.user;

      localStorage.setItem("token", response.token); // Guarda el token
      localStorage.setItem("refreshToken", response.refreshToken); // Si usas refresh token
      localStorage.setItem("user", JSON.stringify(user)); // Guarda el usuario completo
      localStorage.setItem('userId', user._id); 
      navigate("/home", { state: { user } });



    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerName || !registerEmail || !registerPassword) {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await registerUser(registerName, registerEmail, registerPassword);
      console.log('Registration successful:', response);
      alert('Registration successful! Please login.');
      setIsFlipped(false); // Flip back to login side
      setEmail(registerEmail); // Pre-fill email for convenience
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  useEffect(() => {
    const handleGoogleLoginMessage = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:4000") return;

      if (event.data.token) {


        const user: User = event.data.user;
        console.log('User from Google:', user);
        localStorage.setItem('token', event.data.token);
        localStorage.setItem('refreshToken', event.data.refreshToken);
        localStorage.setItem('userId', user._id);
        console.log('Refresh token:', event.data.refreshToken);
        console.log('token:', event.data.token);
        if (event.data.user) {
          navigate('/home', { state: { user } });
        }

      }
    };

    window.addEventListener("message", handleGoogleLoginMessage);

    return () => {
      window.removeEventListener("message", handleGoogleLoginMessage);
    };
  }, [navigate]);

  const loginWithGoogle = () => {
    const googleAuthUrl = "http://localhost:4000/api/users/auth/google";
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      googleAuthUrl,
      "googleAuth",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  // Modifica la función de renderizado para incluir el nuevo contenedor
  return (

//  <div className={styles.loginPage}>
//       <div className={styles.loginContainer}>
//         <h1>Login</h1>
//         <form className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
//           {/* El resto del código del formulario permanece igual */}
//           <div className={styles.formGroup}>
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label htmlFor="password">Password:</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="button" className={styles.button} onClick={handleLogin}>
//             Login
//           </button>
//           <button
//             type="button"
//             className={`${styles.button} ${styles.googleLoginBtn}`}
//             onClick={loginWithGoogle}
//           >
//             Login with Google
//           </button>
//         </form> 

    <div className={styles.wrapper}>
      <div className={styles['card-switch']}>
        <label className={styles.switch}>
          <input 
            type="checkbox" 
            className={styles.toggle} 
            checked={isFlipped}
            onChange={() => setIsFlipped(!isFlipped)}
          />
          <span className={styles.slider}></span>
          <span className={styles['card-side']}></span>
          <div className={styles['flip-card__inner']}>
            {/* Login Form */}
            <div className={styles['flip-card__front']}>
              <div className={styles.title}>Log in</div>
              <form className={styles['flip-card__form']} onSubmit={handleLogin}>
                <input 
                  className={styles['flip-card__input']} 
                  name="email" 
                  placeholder="Email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input 
                  className={styles['flip-card__input']} 
                  name="password" 
                  placeholder="Password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className={styles['flip-card__btn']}>
                  Let's go!
                </button>
                <button
                  type="button"
                  className={styles['flip-card__btn']}
                  onClick={loginWithGoogle}
                >
                  Login with Google
                </button>
              </form>
            </div>
            
            {/* Register Form */}
            <div className={styles['flip-card__back']}>
              <div className={styles.title}>Sign up</div>
              <form className={styles['flip-card__form']} onSubmit={handleRegister}>
                <input 
                  className={styles['flip-card__input']} 
                  placeholder="Name" 
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
                <input 
                  className={styles['flip-card__input']} 
                  name="email" 
                  placeholder="Email" 
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
                <input 
                  className={styles['flip-card__input']} 
                  name="password" 
                  placeholder="Password" 
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
                <button type="submit" className={styles['flip-card__btn']}>
                  Confirm!
                </button>
              </form>
            </div>
          </div>
        </label>
      </div>
      
      <div className={styles.logoContainer}>
        <img src="https://blogger.googleusercontent.com/img/a/AVvXsEgWpqjKdXXYRKEm6V4cXxGYQlTlB3HUEA9PB63z4rMjjlgtbpazYgTQ-jTypEBoXdTTC_wQ60CI3A1yW-H9j6yU576uys39eJMsX0os-jBDwz2ar334II6kn_8l4-79GZbe33VVoLp68xqypqTVxMm1txFhEmhEwyOFYZY4TZESOZoEAyvKplVruuyoZCVl" 
            alt="Logo" 
            className={styles.logo} />
      </div>
    </div>
  );
};

export default Login;
