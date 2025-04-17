import React, { useState } from 'react';
import { UpdateProfilePicture } from '../../service/userService';
import styles from './Cloudinary.module.css';

interface CloudinaryProps {
    initialImage?: string; // Prop para recibir la imagen inicial
    userEmail: string; // Email del usuario para actualizar la imagen
}

const Cloudinary: React.FC<CloudinaryProps> = ({ initialImage, userEmail }) => {
    const preset_name: string = "quickfind";
    const cloud_name: string = "dnt2h1b9z";

    const [image, setImage] = useState<string>(initialImage || ''); // Usamos la imagen inicial si existe
    const [loading, setLoading] = useState<boolean>(false);

    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (!e.target.files) {
            console.error("No files selected");
            return;
        }

        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', preset_name);

        setLoading(true);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data,
            });

            const file = await response.json();
            setImage(file.secure_url); // Actualizamos la imagen de perfil
            console.log('Nueva imagen subida:', file.secure_url);

            await UpdateProfilePicture(userEmail, file.secure_url); // Actualizamos la imagen en el backend
        } catch (error) {
            console.error('Error al subir la imagen:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles['cloudinary-container']}>
            <label htmlFor="file-upload" className={styles['cloudinary-avatar-label']}>
                {loading ? (
                    <div className={styles['cloudinary-loading']}>Cargando...</div>
                ) : (
                    <img
                        src={image || 'https://via.placeholder.com/150'} // Imagen por defecto si no hay avatar
                        alt="Imagen de perfil"
                        className={styles['cloudinary-avatar']}
                    />
                )}
                <input
                    id="file-upload"
                    type="file"
                    className={styles['cloudinary-input']}
                    onChange={(e) => uploadImage(e)}
                />
            </label>
        </div>
    );
};

export default Cloudinary;