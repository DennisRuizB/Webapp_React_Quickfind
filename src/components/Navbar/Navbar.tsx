import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <a href="#" className={styles.navLogo}>
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className={styles.logoImage}
            alt="Logo"
          />
          <span className={styles.logoText}>QuickFind</span>
        </a>

        <div className={styles.navMenu}>
          <ul className={styles.navLinks}>
            <li>
              <a
                href="#"
                className={styles.navLink}
                onClick={() => handleNavClick("/home")}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className={styles.navLink}
                onClick={() => handleNavClick("/services")}
              >
                Services
              </a>
            </li>
            <li>
              <a href="#" className={styles.navLink}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
