import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./CompanyPerfil.module.css";
import { Company } from "../../models/Company";
import { GetCompanyById } from "../../service/companiesService";
import MiniMapa from "../Maps/MiniMapa/MiniMapa";
import StarRating from "../StarRating/StarRating";
import { RateCompany } from "../../service/companiesService";
import { IReview } from "../../models/Review";
import { ReviewCompany } from "../../service/companiesService";
import { getCompanyReviews } from "../../service/companiesService";
import ReviewDisplay from "../Displays/ReviewDisplay/ReviewDisplay";
import  ProductsDisplay from "../Displays/ProductsDisplay/ProductsDisplay";

const CompanyPerfil: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [editedCompany, setEditedCompany] = useState<Company | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Estado para activar/desactivar el modo de edición
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("products");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await GetCompanyById(id || "");
        setCompany(response);
        setEditedCompany(response); // Inicializa los datos editables con los datos originales
      } catch (error) {
        console.error("Error al cargar la compañía:", error);
        setError("No se pudieron cargar los datos de la compañía.");
      }
    };

    fetchCompany();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedCompany((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    try {
      if (!editedCompany) return;
      // Aquí puedes implementar la lógica para guardar los cambios en el backend
      console.log("Datos guardados:", editedCompany);
      setCompany(editedCompany); // Actualiza los datos originales con los editados
      setIsEditing(false); // Desactiva el modo de edición
      alert("Información actualizada correctamente.");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Hubo un error al guardar los cambios.");
    }
  };

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!company) {
    return <p>Cargando datos de la compañía...</p>;
  }

  return (
    <div className={styles.profilePage}>
      {/* Detalles de la compañía a la izquierda */}
      <div className={styles.details}>
        <img
          src={company.icon || "https://via.placeholder.com/150"}
          alt="Logo de la compañía"
          className={styles.companyAvatar}
        />
        {isEditing ? (
          <>
            <input
              type="text"
              name="name"
              value={editedCompany?.name || ""}
              onChange={handleInputChange}
              className={styles.editInput}
            />
            <textarea
              name="description"
              value={editedCompany?.description || ""}
              onChange={handleInputChange}
              className={styles.editTextarea}
            />
            <input
              type="text"
              name="phone"
              value={editedCompany?.phone || ""}
              onChange={handleInputChange}
              className={styles.editInput}
            />
            <button onClick={handleSave} className={styles.saveButton}>
              Guardar
            </button>
            <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>
              Cancelar
            </button>
          </>
        ) : (
          <>
            <h2 className={styles.companyName}>{company.name || "Nombre no disponible"}</h2>
            <p className={styles.companyDescription}>
              <strong>Descripción:</strong> {company.description || "No disponible"}
            </p>
            <p className={styles.companyPhone}>
              <strong>Teléfono:</strong> {company.phone || "No disponible"}
            </p>
            <button onClick={() => setIsEditing(true)} className={styles.editButton}>
              Editar
            </button>
          </>
        )}
      </div>

      {/* Pestañas en el centro */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${selectedTab === "products" ? styles.active : ""}`}
          onClick={() => setSelectedTab("products")}
        >
          Productos
        </button>
        <button
          className={`${styles.tabButton} ${selectedTab === "photos" ? styles.active : ""}`}
          onClick={() => setSelectedTab("photos")}
        >
          Fotos
        </button>
        <button
          className={`${styles.tabButton} ${selectedTab === "map" ? styles.active : ""}`}
          onClick={() => setSelectedTab("map")}
        >
          Mapa
        </button>
        <button
          className={`${styles.tabButton} ${selectedTab === "reviews" ? styles.active : ""}`}
          onClick={() => setSelectedTab("reviews")}
        >
          Reseñas
        </button>
      </div>

      {/* Contenido dinámico a la derecha */}
      <div className={styles.content}>{/* Aquí va el contenido dinámico */}</div>
    </div>
  );
};

export default CompanyPerfil;

