import React from "react";
import styles from "./NavBar_Services.module.css";

const Services: React.FC = () => {
  return (
    <div className={styles.servicesContainer}>
      <h1 className={styles.servicesTitle}>Nuestros Servicios</h1>
      <div className={styles.servicesDescription}>
        <p>Descripción de los servicios</p>
      </div>
      <button className={styles.companyButton}>Company</button>
    </div>
  );
};

export default Services;
