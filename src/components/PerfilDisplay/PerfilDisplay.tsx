import React from "react";
import styles from "./PerfilDisplay.module.css";
import { User } from "../../models/User"; // Asegúrate de que la ruta sea correcta



interface PerfilDisplayProps {
  users: User[];
}

const PerfilDisplay: React.FC<PerfilDisplayProps> = ({ users }) => {
  return (
    <div className={styles.perfilDisplayContainer}>
      <h3>Lista de Usuarios</h3>
      {users.length > 0 ? (
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user._id} className={styles.userItem}>
              <img
                src={user.avatar || "https://via.placeholder.com/50"}
                alt={`${user.name}'s avatar`}
                className={styles.userAvatar}
              />
              <div className={styles.userInfo}>
                <p className={styles.userName}>{user.name}</p>
                <p className={styles.userEmail}>{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay usuarios disponibles.</p>
      )}
    </div>
  );
};

export default PerfilDisplay;