import React from 'react';
import './Perfil.module.css';
import { useLocation } from 'react-router-dom';
import Cloudinary from '../Cloudinary/Cloudinary';


const Perfil: React.FC = () => {
    const location = useLocation();
    const user = location.state?.user;
    console.log(user);
    

    return (
        <div className="perfil-container">
            {user.avatar && (
                <img 
                    src={user.avatar} 
                    alt={`${user.name}'s avatar`} 
                    className="perfil-avatar"
                />
            )}
            <h2 className="perfil-name">{user.name}</h2>
            <p className="perfil-email">{user.email}</p>
            <Cloudinary/>
        </div>
    );
};

export default Perfil;
