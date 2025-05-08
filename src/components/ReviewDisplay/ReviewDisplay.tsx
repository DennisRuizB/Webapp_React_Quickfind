import React from "react";
import styles from "./ReviewDisplay.module.css";
import { I } from "framer-motion/dist/types.d-DDSxwf0n";
import { IReview } from "../../models/Review"; // Importa la interfaz IReview
import PerfilExterno from "../PerfilExterno/PerfilExterno";
import { Navigate, useNavigate } from "react-router-dom";
// interface IUser {
//     _id: string;
//     name: string;
//     email: string;
//     password: string;
//     role: string;
// }

// export interface IReview {
//     user_id: IUser; // Cambiado a IUser
//     company_id: string;
//     rating: number;
//     description: string;
//     date: Date;
//   }

interface ReviewDisplayProps {
  reviews: IReview[]; // Lista de reseñas a mostrar
}

const ReviewDisplay: React.FC<ReviewDisplayProps> = ({ reviews }) => {

    const navigate = useNavigate();
  if (!reviews || reviews.length === 0) {
    return <p className={styles.noReviews}>No hay reseñas disponibles.</p>;
  }
  else{
    console.log("Reseñas:", reviews); // Agregado para depuración
  }

  return (
    <div className={styles.reviewContainer}>
      <h3 className={styles.title}>Reseñas</h3>
      <ul className={styles.reviewList}>
        {reviews.map((review, index) => (
          <li key={index} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <strong className={styles.userId}>
                {/* Verifica si user_id es un objeto o una cadena */}
                {typeof review.user_id === "string" ? (
                  "Usuario desconocido" // Si es un string, muestra un texto genérico
                ) : (
                  <span
                    onClick={() => {
                      if (typeof review.user_id !== "string") {
                        navigate(`/perfilExterno/${review.user_id._id}`);
                      }
                    }}
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    {review.user_id.name}
                  </span> // Si es un objeto, muestra el nombre y permite navegar al perfil
                )}
              </strong>
              <span className={styles.rating}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`${styles.star} ${
                      i < review.rating ? styles.filledStar : ""
                    }`}
                  >
                    ★
                  </span>
                ))}
              </span>
            </div>
            <p className={styles.description}>{review.description}</p>
            <p className={styles.date}>
              {new Date(review.date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewDisplay;