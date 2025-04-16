import React, { useEffect, useRef } from 'react';
import './Home.modules.css';
import { animate } from 'animejs'; // Importación de animate
import { useLocation } from 'react-router-dom';
import BarcelonaMap from '../MapBarcelona/MapBarcelona';
//import styles from '../MapBarcelona/BarcelonaMap.module.css';
import { useNavigate } from 'react-router-dom';


const Home: React.FC = () => {
    const fotoLupa = "https://cdn-icons-png.flaticon.com/512/4715/4715177.png";
    //const perfilIcono = "https://www.flaticon.es/icono-gratis/perfil_7778650";
    const location = useLocation();
    const user = location.state?.user; // Obtén el usuario pasado desde Login
    const headingRef = useRef<HTMLHeadingElement>(null);
    const userName: string = user?.name || 'Guest'; // Usa el nombre del usuario o 'Guest' si no está definido
    const text = `WELCOME ${userName.toUpperCase()}`; // Define el texto para la animación en mayúsculas
    const navigate = useNavigate();

    const handlePerfil = async () => {
            try {
            navigate('/perfil', { state: { user } });
            } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
            }
        };

    useEffect(() => {
        // Asegúrate de que los <span> existen antes de animarlos
        const timeout = setTimeout(() => {
            if (headingRef.current) {
                const spans = headingRef.current.querySelectorAll('span');
                if (spans.length > 0) {
                    animate(spans, {
                        // Propiedades de animación
                        y: [
                            { to: '-2.75rem', ease: 'outExpo', duration: 600 },
                            { to: 0, ease: 'outBounce', duration: 800, delay: 100 },
                        ],
                        rotate: {
                            from: '-1turn',
                            delay: 0,
                        },
                        delay: (_, i) => i * 50, // Retraso basado en el índice
                        ease: 'inOutCirc',
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
            <button type="button" className="Perfil"onClick={()=>handlePerfil()} >
                    Perfil
            </button>
            <header className="App-header">
                <h2 ref={headingRef} className="large grid centered square-grid text-xl">
                        {text.split('').map((char, index) => (
                            <span key={index}>{char === ' ' ? '\u00A0' : char}</span>
                        ))}
                </h2>
                <img src={fotoLupa} className="App-logo" alt="logo" />
                <BarcelonaMap/>
            </header>
          


        </div>
        
    );
};

export default Home;