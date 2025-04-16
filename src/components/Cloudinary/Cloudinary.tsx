import React, { useState } from 'react';
import { UpdateProfilePicture } from '../../service/userService';
import { useLocation } from 'react-router-dom';

const Cloudinary: React.FC = () => {

    const location = useLocation();
    const user = location.state?.user;

    const preset_name: string = "quickfind"; // Tipamos como string
    const cloud_name: string = "dnt2h1b9z"; // Tipamos como string

    const [image, setImage] = useState<string>(''); // Tipamos el estado local como string
    const [loading, setLoading] = useState<boolean>(false); // Tipamos como boolean
    const [imageUrl, setImageUrl] = useState<string>(''); // Estado para almacenar la URL de la imagen


    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => { // Tipamos el evento y retornamos una Promise<void>
        if (!e.target.files) { // Verificamos si files es null o undefined
            console.error("No files selected");
            return;
        }

        const files = e.target.files; // Recuperamos el array de archivos
        const data = new FormData(); // Creamos/Instanciamos un FormData objeto con nombre data
        data.append('file', files[0]); // Agregamos el archivo desde files[0]
        data.append('upload_preset', preset_name); // Pasamos el "upload preset"

        setLoading(true); // Indicamos que la imagen se está cargando

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data,
            });

            const file = await response.json(); // Traducimos la respuesta de JSON
            setImage(file.secure_url); // Recuperamos la URL segura de la imagen
            setImageUrl(file.secure_url);
            console.log(file.secure_url);
            setLoading(false); // Ponemos el loading en false para mostrar la imagen
            const guardar = await UpdateProfilePicture(user.email, file.secure_url);

            // await actions.sendPhoto(file.secure_url); // Si necesitas enviar la URL al backend
        } catch (error) {
            console.error('Error uploading image:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Upload Image</h1>

            {/* El input para enviar la imagen al handler uploadImage */}
            <input
                type="file"
                name="file"
                placeholder="Upload an image"
                onChange={(e) => uploadImage(e)}
            />

            {/* Mostramos loading si está cargando, de lo contrario mostramos la imagen */}
            {loading ? (
                <h3>Loading...</h3>
            ) : (
                <>
                    <img src={image} alt="Imagen subida" />
                    {imageUrl && <p>Image URL: {imageUrl}</p>} {/* Mostramos la URL */}
                </>
            )}
        </div>
    );
};

export default Cloudinary;
