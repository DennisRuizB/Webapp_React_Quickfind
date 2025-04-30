import React, { useState } from "react";
import styles from "./StarRating.module.css";

interface StarRatingProps {
  onSubmit: (rating: number) => void; // Función para manejar el envío de la calificación
}

const StarRating: React.FC<StarRatingProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState<number>(0); // Calificación seleccionada
  const [hover, setHover] = useState<number>(0); // Calificación al pasar el mouse

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating); // Llama a la función de envío con la calificación
    } else {
      alert("Por favor selecciona una calificación.");
    }
  };

  return (
    <div className={styles.starRating}>
      <div className={styles.stars}>
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={`${styles.star} ${
              index < (hover || rating) ? styles.filledStar : ""
            }`}
            onClick={() => setRating(index + 1)} // Selecciona la calificación
            onMouseEnter={() => setHover(index + 1)} // Muestra el hover
            onMouseLeave={() => setHover(0)} // Quita el hover
          >
            ★
          </span>
        ))}
      </div>
      <button onClick={handleSubmit} className={styles.submitButton}>
        Enviar Reseña
      </button>
    </div>
  );
};

export default StarRating;