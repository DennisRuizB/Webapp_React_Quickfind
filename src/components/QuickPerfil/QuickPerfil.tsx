import React from 'react';
import styles from './QuickPerfil.module.css';
import { useNavigate } from 'react-router-dom';

interface QuickPerfilProps {
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
    onClose: () => void; // Función para cerrar el desplegable
}



const QuickPerfil: React.FC<QuickPerfilProps> = ({ user, onClose }) => {
    const navigate = useNavigate();

    const handlePerfil = async () => {
            try {
            navigate('/perfil', { state: { user } });
            } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
            }
    };

    const handleLogout = () => {
        // Eliminar todos los datos del localStorage
        localStorage.clear();

        // Redirigir al usuario a la página de login
        navigate('/login');

        // Cerrar el desplegable después de cerrar sesión
        onClose();
    };


    return (
        <div className={styles['quick-perfil-container']}>
            <button className={styles['close-button']} onClick={onClose}>
                Cerrar
            </button>
            <div className={styles['quick-perfil-header']}>
                <img
                    src={user.avatar || 'https://via.placeholder.com/150'}
                    alt="Avatar"
                    className={styles['quick-perfil-avatar']}
                />
                <h2 className={styles['quick-perfil-name']}>{user.name || 'Nombre no disponible'}</h2>
                <p className={styles['quick-perfil-email']}>{user.email || 'Email no disponible'}</p>
            </div>
            <div className={styles['quick-perfil-actions']}>
                <button className={styles['action-button']} onClick={handlePerfil}>Perfil</button>
                <button className={styles['action-button']} onClick={handleLogout}>Cerrar Sesión</button>
            </div>
        </div>
    );
};

export default QuickPerfil;