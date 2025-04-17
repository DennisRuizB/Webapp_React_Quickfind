import React, {useState, useEffect} from 'react';
import styles from './Perfil.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Cloudinary from '../Cloudinary/Cloudinary';
import { UpdateUserById } from '../../service/userService';
import { getOrdersByUserId } from '../../service/orderService'; // Asegúrate de importar la función correcta para obtener órdenes

const Perfil: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialUser = location.state?.user;

    
    const [user, setUser] = useState(initialUser); // Estado local para el usuario
    const [isEditing, setIsEditing] = useState(false); // Estado para alternar entre edición y visualización
    const [editedUser, setEditedUser] = useState({
        _id: user?._id || '',
        email: user?.email || '',
        name: user?.name || '',
        phone: user?.phone || '',
        description: user?.description || '',
    });

    const [recentOrders, setRecentOrders] = useState<any[]>([]); // Estado para las órdenes recientes

    useEffect(() => {
        setEditedUser({
            _id: user?._id || '',
            email: user?.email || '',
            name: user?.name || '',
            phone: user?.phone || '',
            description: user?.description || '',
        });

        // Cargar órdenes recientes
        const fetchOrders = async () => {
            if (user?._id) {
                try {
                    const orders = await getOrdersByUserId(user._id); // Llama al servicio para obtener las órdenes
                    console.log('Órdenes recientes:', orders); // Verifica la respuesta
                    setRecentOrders(orders || []); // Asegúrate de que 'orders' sea un array
                } catch (error) {
                    console.error('Error al cargar las órdenes recientes:', error);
                }
            }
        };

        fetchOrders();
    }, [user]);

    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        
        // Aquí puedes hacer la lógica para guardar los cambios en el backend
        
        console.log("Usuarioooo:", editedUser);
        

        const updatedUser = await UpdateUserById({
            ...editedUser,
            _id: user._id,
            email: user.email,
            password: user.password,
        });
        
        console.log('Datos guardados:', editedUser);
        console.log('Usuario actualizado:', updatedUser);
        setUser(updatedUser);

        setIsEditing(false); // Volver al modo de visualización
    };

    const handleHome= () => {
        navigate(-1); // Navega a la página anterior
    };

    if (!user) {
        return <p>No se encontró información del usuario.</p>;
    }

       return (
        <div className = {styles['perfil-wrapper']}>
        <div className={styles['perfil-container']}>
             <Cloudinary initialImage={user.avatar} userEmail={user.email}/>
             <p className={styles['perfil-email']}><strong>ID:</strong> {user._id || 'No disponible'}</p>
             <div className={styles['perfil-divider']}></div>
             {isEditing ? (
                <>
                    <input
                        type="text"
                        name="name"
                        value={editedUser.name}
                        onChange={handleInputChange}
                        className={styles['perfil-input']}
                        placeholder="Nombre"
                    />
                    <p className={styles['perfil-email']}><strong>Email:</strong> {user.email || 'No disponible'}</p>
                    <input
                        type="text"
                        name="phone"
                        value={editedUser.phone}
                        onChange={handleInputChange}
                        className={styles['perfil-input']}
                        placeholder="Teléfono"
                    />
                    <div className={styles['perfil-divider']}></div>
                    <p className={styles['perfil-wallet']}><strong>Billetera:</strong> ${user.wallet !== undefined ? user.wallet.toFixed(2) : 'No disponible'}</p>
                    <textarea
                        name="description"
                        value={editedUser.description}
                        onChange={handleInputChange}
                        className={styles['perfil-textarea']}
                        placeholder="Descripción"
                    />
                </>
            ) : (
                <>
                    <h2 className={styles['perfil-name']}>{user.name || 'Nombre no disponible'}</h2>
                    <p className={styles['perfil-email']}><strong>Email:</strong> {user.email || 'No disponible'}</p>
                    <p className={styles['perfil-phone']}><strong>Teléfono:</strong> {user.phone || 'No disponible'}</p>
                    <div className={styles['perfil-divider']}></div>
                    <p className={styles['perfil-wallet']}><strong>Billetera:</strong> ${user.wallet !== undefined ? user.wallet.toFixed(2) : 'No disponible'}</p>
                    <p className={styles['perfil-description']}><strong>Descripción:</strong> {user.description || 'No hay descripción'}</p>
                </>
            )}

            <div className={styles['perfil-divider']}></div>
            <span
                className={`${styles['perfil-status']} ${user.Flag ? '' : styles['inactive']}`}
            >
                <strong>Estado:</strong> {user.Flag !== undefined ? (user.Flag ? 'Activo' : 'Inactivo') : 'No disponible'}
            </span>

            <div className={styles['perfil-actions']}>
                <div>
                    {isEditing ? (
                        <div className={styles['perfil-buttons']}>
                            <button onClick={handleSave} className={styles['perfil-button']}>
                                Guardar
                            </button>
                            
                            <button onClick={() => setIsEditing(false)} className={styles['perfil-button']}>
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className={styles['perfil-button']}>
                            Modificar Perfil
                        </button>
                    )}
                </div>
            </div>
            
            <div className={styles['perfil-home']}>
                <button onClick={handleHome} className={styles['perfil-button']}>
                    Volver Página Principal
                </button>
            </div>

        </div>

        <div className={styles['orders-container']}>
                <h3>Órdenes Recientes</h3>
                {recentOrders.length > 0 ? (
                    <ul>
                        {recentOrders.map((order, index) => (
                            <li key={order._id || index} className={styles['order-item']}>
                            <p><strong>ID de Orden:</strong> {order._id}</p>
                            <p><strong>Productos:</strong></p>
                            <ul>
                                {order.products.map((product: any, index: number) => (
                                    <li key={index}>
                                        Nombre: {product.product_id.name}, Cantidad: {product.quantity}
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Fecha:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                            <p><strong>Estado:</strong> {order.status}</p>
                        </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay órdenes recientes.</p>
                )}
            </div>

        </div>
        

        
    );
            
    
};

export default Perfil;
