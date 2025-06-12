import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuickPerfil from '../Profiles/QuickPerfil/QuickPerfil'; // Importa el componente
import styles from './Navbar.module.css';
import { useEffect, useRef } from 'react';
import { getUserById } from '../../service/userService'; // Asegúrate de que la ruta sea correcta
import NotificationBell from '../Notifications/NotificationBell';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [showQuickPerfil, setShowQuickPerfil] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = React.useState<any>(null); // Cambia el tipo según tu modelo de usuario
  // Obtén el usuario desde localStorage

  const handleNavClick = (path: string) => {
    navigate(path);
  };

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

  const [menuOpen, setMenuOpen] = React.useState(false);


  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <a href="#" className={styles.navLogo}>
          <img
            src="/quickfind_logo.png"
            className={styles.logoImage}
            alt="Logo"
          />
        </a>

        {/* Menú Hamburguesa */}
        <div
          className={styles.menuToggle}
          onClick={toggleMenu}
          role="button"
          aria-label="Toggle navigation menu">
          ☰
        </div>

        {/* Menú de navegación */}
        <div 
          ref={menuRef}
          className={`${styles.navMenu} ${menuOpen ? styles.active : ''}`}>
          <ul className={styles.navLinks}>
            <li>
              <a
                href="#"
                className={styles.navLink}
                onClick={() => handleNavClick('/home')}>
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className={styles.navLink}
                onClick={() => handleNavClick('/services')}>
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className={styles.navLink}
                onClick={() => handleNavClick('/about')}>
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className={styles.navLink}
                onClick={() => handleNavClick('/contact')}>
                Contact
              </a>
            </li>
            <li>
              <button
                className={styles.cartButton}
                onClick={() => navigate('/cart')}>
                🛒
              </button>
            </li>
          </ul>
        </div>
        <div className={styles.rightSection}>
          <NotificationBell count={0} />
          <div className={styles.profileIconContainer}>
            <img
              src={user?.avatar || 'https://via.placeholder.com/50'}
              alt="Profile"
              className={styles.profileIcon}
              onClick={toggleQuickPerfil}
            />
          </div>
        </div>

        {/* Componente QuickPerfil */}
        {showQuickPerfil && user && (
          <div className={styles.quickPerfilOverlay}>
            <QuickPerfil user={user} onClose={toggleQuickPerfil} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
