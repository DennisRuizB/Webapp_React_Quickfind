import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";
import { User } from "../../models/User";
import { useNavigate } from "react-router-dom";
import { logInUser } from "../../service/userService";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
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
      navigate("/home", { state: { user } });
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    const handleGoogleLoginMessage = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:4000") return;

      if (event.data.token) {
        localStorage.setItem("token", event.data.token);
        if (event.data.user) {
          localStorage.setItem("user", JSON.stringify(event.data.user));
        }
        navigate("/home");
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

    const googleAuthWindow = window.open(
      googleAuthUrl,
      "googleAuth",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // const checkWindowClosed = setInterval(() => {
    //   if (googleAuthWindow && googleAuthWindow.closed) {
    //     clearInterval(checkWindowClosed);
    //     console.log('Google Auth window closed.');
    //   }
    // }, 500);
  };

  // Modifica la función de renderizado para incluir el nuevo contenedor
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h1>Login</h1>
        <form className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
          {/* El resto del código del formulario permanece igual */}
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
