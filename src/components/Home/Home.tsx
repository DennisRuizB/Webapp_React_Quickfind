
import React, { useEffect, useRef, useState } from "react";
import "./Home.modules.css";
import { animate } from "animejs"; // Importación de animate
import { useLocation } from "react-router-dom";
import BarcelonaMap from "../MapBarcelona/MapBarcelona";
//import styles from '../MapBarcelona/BarcelonaMap.module.css';
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../service/userService";
import QuickPerfil from "../QuickPerfil/QuickPerfil";


const Home: React.FC = () => {
  const fotoLupa = "https://cdn-icons-png.flaticon.com/512/4715/4715177.png";
  //const perfilIcono = "https://www.flaticon.es/icono-gratis/perfil_7778650";
  const location = useLocation();
  const navigate = useNavigate();


  const prov_user = location.state?.user; // Obtén el usuario pasado desde Login
  const userFromStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "")
    : null;
  const [user, setUser] = useState(prov_user || userFromStorage);
  const [showQuickPerfil, setShowQuickPerfil] = useState(false);


  const headingRef = useRef<HTMLHeadingElement>(null);
  const userName: string = user?.name || "Guest"; // Usa el nombre del usuario o 'Guest' si no está definido
  const text = `WELCOME ${userName.toUpperCase()}`; // Define el texto para la animación en mayúsculas


  const toggleQuickPerfil = () => {
    setShowQuickPerfil((prev) => !prev);
  };



    

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId'); // Obtenir l'ID de l'usuari del localStorage
            if (!userId) {
                console.warn('No user ID found. Redirecting to login...');
                navigate('/login'); // Redirigir si no hi ha usuari
                return;
            }
    
            try {
                const updatedUser = await getUserById(userId); // Crida a l'API per obtenir l'usuari complet
                setUser(updatedUser); // Actualitzar l'estat amb l'usuari complet
                console.log('User data fetched:', updatedUser); // Verifica la resposta
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login'); // Redirigir en cas d'error
            }
        };
    
        fetchUser();
    }, [navigate]); // Elimina `user` del array de dependencias


  // // Modifica el useEffect que contiene fetchUser (líneas 33-45)
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     if (user?._id) {
  //       try {
  //         const updatedUser = await getUserById(user._id); // Llama al backend para obtener los datos actualizados
  //         setUser(updatedUser); // Actualiza el estado con los datos del backend
  //         localStorage.setItem("user", JSON.stringify(updatedUser)); // Actualiza storage
  //       } catch (error) {
  //         console.error("Error al obtener los datos del usuario:", error);
  //       }
  //     }
  //   };

  //   fetchUser();
  // }, [user?._id]);

  useEffect(() => {
    // Asegúrate de que los <span> existen antes de animarlos
    const timeout = setTimeout(() => {
      if (headingRef.current) {
        const spans = headingRef.current.querySelectorAll("span");
        if (spans.length > 0) {
          animate(spans, {
            // Propiedades de animación
            y: [
              { to: "-2.75rem", ease: "outExpo", duration: 600 },
              { to: 0, ease: "outBounce", duration: 800, delay: 100 },
            ],
            rotate: {
              from: "-1turn",
              delay: 0,
            },
            delay: (_, i) => i * 50, // Retraso basado en el índice
            ease: "inOutCirc",
            loopDelay: 1000,
            loop: true,
          });
        }
      }
    }, 0); // Asegúrate de que React haya renderizado los elementos

    return () => clearTimeout(timeout); // Limpia el timeout al desmontar el componente
  }, []);

  return (
    <div className="App">
      
      <header className="App-header">
        <h2
          ref={headingRef}
          
        >
          {text.split("").map((char, index) => (
            <span key={index}>{char === " " ? "\u00A0" : char}</span>
          ))}
        </h2>
        <img src={fotoLupa} className="App-logo" alt="logo" />

        <BarcelonaMap />
      </header>
    </div>
  );
};

export default Home;
