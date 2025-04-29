import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar/Navbar";

// Componente contenedor para usar useLocation
const AppContent = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    // Escuchar cambios en localStorage para actualizar el estado cuando se inicie o cierre sesión
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    // También revisar el token cada vez que la ventana recibe el foco
    window.addEventListener("focus", checkAuth);  

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", checkAuth);
    };
  }, []);

  // No mostrar Navbar en la página de login
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/";

  return (
    <>
      {isAuthenticated && !isLoginPage && <Navbar />}
      <AppRoutes />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
