import React, { useRef, useEffect, useState, use } from "react";
import styles from "./NavBar_Services.module.css";
import { motion } from "framer-motion";
import { Company } from "../../models/Company";
import { Product } from "../../models/Product";
import {
  GetAllCompanies,
  UpdateCompanyById,
  AddProductToCompany,
  CreateProduct,
  GetUserCompanies,
  LoginCompany,
} from "../../service/companiesService"; // Importamos el servicio para obtener empresas
import { FaSearch, FaMapMarkedAlt, FaStore, FaEdit } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaApple, FaAndroid } from "react-icons/fa";
import {
  FollowCompany,
  getUserById,
  UnfollowCompany,
} from "../../service/userService";
import { User } from "../../models/User"; // Importamos el modelo de usuario

interface FollowedCompany {
  company_id: string;
  _id: string;
}

const NavBar_Services: React.FC = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const thirdSectionRef = useRef<HTMLDivElement>(null);
  const [inViewport, setInViewport] = useState(true);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const updateFormRef = useRef<HTMLDivElement>(null);
  const productFormRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<
    "none" | "view" | "add" | "existing"
  >("none");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [userCompanies, setUserCompanies] = useState<Company[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}") as {
    _id: string;
    company_Followed: FollowedCompany[];
  };
  const [currentUser, setCurrentUser] = useState(user);
  // Estado para el carrusel de imágenes
  const [currentImage, setCurrentImage] = useState(0);
  const totalImages = 7;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [productIsSubmitting, setProductIsSubmitting] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [productSuccess, setProductSuccess] = useState(false);
  //estados para manage company
  // Añadir estos estados junto a los otros useState al inicio del componente
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordIsSubmitting, setPasswordIsSubmitting] = useState(false);
  const passwordFormRef = useRef<HTMLDivElement>(null);
  // Form state para empresas
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    email: "",
    phone: "",
    password: "",
  });

  // Form state para productos
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
  });
  // Auto rotar imágenes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % totalImages);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Nuevas variantes de animación para los servicios
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };
  // Cargar las empresas del usuario cuando se necesiten
  useEffect(() => {
    if (activeSection === "existing") {
      const loadUserCompanies = async () => {
        try {
          const companies = await GetUserCompanies(currentUser._id);
          setUserCompanies(companies);
        } catch (error) {
          console.error("Error loading companies:", error);
        }
      };

      loadUserCompanies();
    }
  }, [activeSection, currentUser._id]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const fetchUser = async () => {
      if (!storedUserId) return;
      const user = await getUserById(storedUserId || "");
      setCurrentUser(user || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!outerRef.current) return;

    const onChange = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.target === outerRef.current) {
          setInViewport(entry.isIntersecting);
        }
      });
    };

    const observer = new IntersectionObserver(onChange, { threshold: 0.5 });
    observer.observe(outerRef.current);

    return () => {
      if (outerRef.current) {
        observer.unobserve(outerRef.current);
      }
    };
  }, []);

  const handleFollowToggle = async (companyId: string) => {
    if (!currentUser) {
      alert("No user is logged in.");
      return;
    }
    const isFollowing = currentUser.company_Followed?.some(
      (followed: FollowedCompany) => followed.company_id === companyId
    );

    try {
      if (isFollowing) {
        await UnfollowCompany(currentUser._id, companyId);
        const updatedFollowed = currentUser.company_Followed.filter(
          (followed: FollowedCompany) => followed.company_id !== companyId
        );
        setCurrentUser({ ...currentUser, company_Followed: updatedFollowed });
      } else {
        console.log("Following company:", currentUser._id, companyId);
        await FollowCompany(currentUser._id, companyId);
        const updatedFollowed = [
          ...currentUser.company_Followed,
          { company_id: companyId, _id: "" },
        ];
        setCurrentUser({ ...currentUser, company_Followed: updatedFollowed });
      }

      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch (error) {
      console.error(
        `Error while toggling follow for company ${companyId}:`,
        error
      );
      alert(
        "An error occurred while updating your follow status. Please try again."
      );
    }
  };

  useEffect(() => {
    // Scroll to third section when a button is clicked
    if (activeSection !== "none" && thirdSectionRef.current) {
      setTimeout(() => {
        thirdSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "view") {
      const fetchAllCompanies = async () => {
        try {
          const companies = await GetAllCompanies();
          setAllCompanies(companies);
        } catch (error) {
          console.error("Error loading companies:", error);
        }
      };

      fetchAllCompanies();
    }
  }, [activeSection]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Por ahora, una implementación básica
    console.log("Creating new company:", formData);

    // Aquí podrías añadir la llamada al API para crear la empresa
    alert("Company submitted successfully!");

    // Resetea el formulario
    setFormData({
      name: "",
      description: "",
      location: "",
      email: "",
      phone: "",
      password: "",
    });

    // Opcional: redirige al usuario a la sección de empresas existentes
    setActiveSection("existing");
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCompany) {
      setUpdateError("No company selected to update");
      return;
    }

    setIsSubmitting(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      // Define el tipo explícitamente para incluir la propiedad password opcional
      const updateData: {
        name: string;
        description: string;
        location: string;
        email: string;
        phone: string;
        password?: string; // hacemos password opcional con ?
      } = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        email: formData.email,
        phone: formData.phone,
      };

      // Añadir contraseña solo si se ha proporcionado una nueva
      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password;
      }

      // Llamar al servicio de actualización
      const updatedCompany = await UpdateCompanyById(
        selectedCompany._id,
        updateData
      );

      // Actualizar la lista local de empresas
      setUserCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company._id === updatedCompany._id ? updatedCompany : company
        )
      );

      // Mostrar mensaje de éxito
      setUpdateSuccess(true);
      setTimeout(() => {
        setShowUpdateForm(false);
        setUpdateSuccess(false);
      }, 2000);
    } catch (error: any) {
      // Manejar errores específicos
      if (error.message === "El email ya está registrado") {
        setUpdateError("This email is already registered by another company");
      } else {
        setUpdateError(`Error updating company: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) {
      setProductError("No company selected!");
      return;
    }

    setProductIsSubmitting(true);
    setProductError(null);
    setProductSuccess(false);

    try {
      // Primero, crear el producto
      const newProduct = await CreateProduct(productData);

      // Luego, asociarlo con la empresa
      const updatedCompany = await AddProductToCompany(
        selectedCompany._id,
        newProduct._id
      );

      // Actualizar la UI
      setUserCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company._id === updatedCompany._id ? updatedCompany : company
        )
      );

      // Mostrar mensaje de éxito
      setProductSuccess(true);
      setTimeout(() => {
        setShowProductForm(false);
        setProductSuccess(false);
      }, 2000);

      // Resetear formulario
      setProductData({
        name: "",
        description: "",
        price: 0,
      });
    } catch (error: any) {
      setProductError(`Error adding product: ${error.message}`);
    } finally {
      setProductIsSubmitting(false);
    }
  };

  const handleUpdateCompany = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      description: company.description,
      location: company.location,
      email: company.email,
      phone: company.phone,
      password: "", // No mostramos la contraseña por seguridad
    });
    setShowUpdateForm(true);
    setShowProductForm(false);
    setTimeout(() => {
      updateFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAddProduct = (company: Company) => {
    setSelectedCompany(company);
    setProductData({
      name: "",
      description: "",
      price: 0,
    });
    setShowProductForm(true);
    setShowUpdateForm(false);
    setTimeout(() => {
      productFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleManage = (company: Company) => {
    setSelectedCompany(company);
    setPasswordInput("");
    setPasswordError(null);
    setPasswordSuccess(false);
    setShowPasswordForm(true);
    setShowUpdateForm(false);
    setShowProductForm(false);
    setTimeout(() => {
      passwordFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  const navigate = useNavigate(); // Asegúrate de que ya está importado al inicio del componente
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCompany) {
      setPasswordError("No company selected");
      return;
    }

    setPasswordIsSubmitting(true);
    setPasswordError(null);

    try {
      // Llamar a la API real de login en lugar de la simulación
      await LoginCompany(selectedCompany.email, passwordInput);

      // Si la autenticación es exitosa
      setPasswordSuccess(true);

      // Guardar información de la empresa en localStorage para la sesión
      localStorage.setItem("companyId", selectedCompany._id);
      localStorage.setItem("companyName", selectedCompany.name);

      // Esperar un momento y redirigir a la página de administración
      setTimeout(() => {
        navigate(`/companyManage/${selectedCompany._id}`);
      }, 1500);
    } catch (error: any) {
      console.error("Login error:", error);
      setPasswordError(error.message || "Invalid password. Please try again.");
    } finally {
      setPasswordIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeInContainerWithStagger = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.25,
        type: "tween",
        ease: "easeIn",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
      },
    },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  if (!currentUser) {
    return <p>Loading user data...</p>; // Show loading state while fetching user data
  }

  return (
    <div className={styles.servicesPageContainer}>
      {/* Primera sección - Texto principal */}
      <section className={styles.topSection}>
        <div>
          {/* Encabezado principal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={styles.servicesTitle}>Why Choose QuickFind?</h1>
            <p className={styles.servicesDescription}>
              QuickFind connects shoppers with local businesses, making it
              easier to find exactly what you need nearby, saving you time and
              supporting local commerce.
            </p>
          </motion.div>

          {/* Tarjetas de servicios */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={styles.servicesGrid}
          >
            {/* Servicio 1 */}
            <motion.div variants={childVariants} className={styles.serviceCard}>
              <div
                className={`${styles.serviceIconWrapper} ${styles.serviceIconBlue}`}
              >
                {FaSearch({ className: styles.serviceIcon })}
              </div>
              <h3 className={styles.serviceTitle}>Smart Product Search</h3>
              <p className={styles.serviceDescription}>
                Find products across multiple nearby stores with real-time
                availability and pricing.
              </p>
            </motion.div>

            {/* Servicio 2 */}
            <motion.div variants={childVariants} className={styles.serviceCard}>
              <div
                className={`${styles.serviceIconWrapper} ${styles.serviceIconGreen}`}
              >
                {FaMapMarkedAlt({ className: styles.serviceIcon })}
              </div>
              <h3 className={styles.serviceTitle}>Interactive Maps</h3>
              <p className={styles.serviceDescription}>
                Discover stores on an interactive map with ratings, reviews, and
                directions.
              </p>
            </motion.div>

            {/* Servicio 3 */}
            <motion.div variants={childVariants} className={styles.serviceCard}>
              <div
                className={`${styles.serviceIconWrapper} ${styles.serviceIconPurple}`}
              >
                {FaStore({ className: styles.serviceIcon })}
              </div>
              <h3 className={styles.serviceTitle}>Local Business Visibility</h3>
              <p className={styles.serviceDescription}>
                We help small businesses increase their visibility and connect
                with local customers.
              </p>
            </motion.div>

            {/* Servicio 4 */}
            <motion.div variants={childVariants} className={styles.serviceCard}>
              <div
                className={`${styles.serviceIconWrapper} ${styles.serviceIconAmber}`}
              >
                {FaEdit({ className: styles.serviceIcon })}
              </div>
              <h3 className={styles.serviceTitle}>Store Management</h3>
              <p className={styles.serviceDescription}>
                Store owners can update information and manage product inventory
                easily.
              </p>
            </motion.div>
          </motion.div>

          {/* Carrusel de imágenes */}
          <div className={styles.mediaSection}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className={styles.carouselContainer}
            >
              <div className={styles.carouselContent}>
                <div className={styles.carouselImageContainer}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage}
                      src={`/NavBar_Services_Photos/${currentImage + 1}.png`}
                      alt={`QuickFind app screenshot ${currentImage + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className={styles.carouselImage}
                    />
                  </AnimatePresence>
                </div>
              </div>

              {/* Indicadores del carrusel */}
              <div className={styles.carouselIndicators}>
                {Array.from({ length: totalImages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`${styles.carouselDot} ${
                      index === currentImage ? styles.carouselDotActive : ""
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className={styles.downloadSectionStandalone}
            >
              <h3 className={styles.downloadTitle}>
                Get QuickFind on your device
              </h3>
              <div className={styles.downloadButtons}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={styles.downloadButton}
                >
                  {FaApple({ className: styles.downloadIcon })}
                  Download for iOS
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={styles.downloadButton}
                >
                  {FaAndroid({ className: styles.downloadIcon })}
                  Download for Android
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mantén el indicador de desplazamiento */}
        <div className={styles.scrollIndicator}>
          <p>Scroll for more information</p>
          <div className={styles.scrollArrow}></div>
        </div>
      </section>
      {/* Segunda sección con animación y botones */}
      <div ref={outerRef} className={styles.bottomSection}>
        {inViewport && (
          <motion.div
            className={styles.animatedContent}
            variants={fadeInContainerWithStagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp}>
              <h2 className={styles.bottomSectionTitle}>
                Explore Our Partner Companies
              </h2>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <p className={styles.bottomSectionText}>
                Discover all the local businesses that are part of our network.
                From restaurants to specialty stores, we have a wide variety of
                options to meet your needs.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className={styles.buttonContainer}>
              <button
                className={`${styles.companyButton} ${styles.leftButton}`}
                onClick={() => setActiveSection("view")}
              >
                View Companies
              </button>
              <button
                className={`${styles.companyButton} ${styles.rightButton}`}
                onClick={() => setActiveSection("add")}
              >
                Add Company
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Tercera sección - Condicional basada en botón presionado */}
      {activeSection !== "none" && (
        <div ref={thirdSectionRef} className={styles.thirdSection}>
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className={styles.thirdSectionContent}
          >
            {activeSection === "view" && (
              <div className={styles.viewCompaniesContainer}>
                <h3>Company Directory</h3>

                {allCompanies.length > 0 ? (
                  <div className={styles.companiesTableWrapper}>
                    <table className={styles.companiesTable}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Location</th>
                          <th>Email</th>
                          <th>Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allCompanies.map((company) => (
                          <tr key={company._id}>
                            <td>{company.name}</td>
                            <td className={styles.descriptionCell}>
                              {company.description.length > 50
                                ? `${company.description.substring(0, 50)}...`
                                : company.description}
                            </td>
                            <td>{company.location}</td>
                            <td>{company.email}</td>
                            <td>{company.phone}</td>
                            <td className={styles.centerButtonCell}>
                              <button
                                className={`${styles.actionButton} ${
                                  currentUser.company_Followed?.some(
                                    (followed: FollowedCompany) =>
                                      followed.company_id === company._id
                                  )
                                    ? styles.unfollowButton
                                    : styles.followButton
                                }`}
                                onClick={() => handleFollowToggle(company._id)}
                              >
                                {currentUser.company_Followed?.some(
                                  (followed: FollowedCompany) =>
                                    followed.company_id === company._id
                                )
                                  ? "UnFollow"
                                  : "Follow"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No companies found. Please try again later.</p>
                )}
              </div>
            )}

            {activeSection === "add" && (
              <div className={styles.addCompanyForm}>
                <h3>Add New Company</h3>
                <p className={styles.switchOption}>
                  Already have a company?{" "}
                  <button
                    className={styles.linkButton}
                    onClick={() => setActiveSection("existing")}
                  >
                    Manage your existing companies
                  </button>
                </p>
                <form onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Company Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <button type="submit" className={styles.submitButton}>
                    Create Company
                  </button>
                </form>
              </div>
            )}

            {activeSection === "existing" && (
              <div className={styles.existingCompaniesContainer}>
                <h3>Your Companies</h3>

                {userCompanies.length > 0 ? (
                  <div className={styles.companiesTableWrapper}>
                    <table className={styles.companiesTable}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Location</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userCompanies.map((company) => (
                          <tr key={company._id}>
                            <td>{company.name}</td>
                            <td className={styles.descriptionCell}>
                              {company.description.length > 50
                                ? `${company.description.substring(0, 50)}...`
                                : company.description}
                            </td>
                            <td>{company.location}</td>
                            <td>{company.email}</td>
                            <td>{company.phone}</td>
                            <td className={styles.actionButtons}>
                              <button
                                className={styles.updateButton}
                                onClick={() => handleUpdateCompany(company)}
                              >
                                Update
                              </button>
                              <button
                                className={styles.addProductButton}
                                onClick={() => handleAddProduct(company)}
                              >
                                Add Product
                              </button>
                              <button
                                className={styles.manageButton}
                                onClick={() => handleManage(company)}
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>
                    You don't have any companies yet.{" "}
                    <button
                      className={styles.linkButton}
                      onClick={() => setActiveSection("add")}
                    >
                      Add a company
                    </button>
                    .
                  </p>
                )}

                {/* Formulario para actualización de empresa */}
                {showUpdateForm && selectedCompany && (
                  <div ref={updateFormRef} className={styles.updateCompanyForm}>
                    <h4>Update Company: {selectedCompany.name}</h4>

                    {/* Mostrar mensajes de error */}
                    {updateError && (
                      <div className={styles.errorMessage}>{updateError}</div>
                    )}

                    {/* Mostrar mensaje de éxito */}
                    {updateSuccess && (
                      <div className={styles.successMessage}>
                        Company updated successfully!
                      </div>
                    )}

                    <form onSubmit={handleUpdateSubmit}>
                      <div className={styles.formGroup}>
                        <label htmlFor="update-name">Company Name</label>
                        <input
                          type="text"
                          id="update-name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="update-description">Description</label>
                        <textarea
                          id="update-description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="update-location">Location</label>
                        <input
                          type="text"
                          id="update-location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="update-email">Email</label>
                        <input
                          type="email"
                          id="update-email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="update-phone">Phone</label>
                        <input
                          type="tel"
                          id="update-phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="update-password">
                          Password (leave empty to keep current)
                        </label>
                        <input
                          type="password"
                          id="update-password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Leave empty to keep current password"
                          disabled={isSubmitting}
                        />
                      </div>

                      <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Updating..." : "Update Company"}
                      </button>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => setShowUpdateForm(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                )}

                {/* Formulario para añadir productos */}
                {showProductForm && selectedCompany && (
                  <div ref={productFormRef} className={styles.addProductForm}>
                    <h4>Add Product to {selectedCompany.name}</h4>

                    {/* Mostrar mensajes de error */}
                    {productError && (
                      <div className={styles.errorMessage}>{productError}</div>
                    )}

                    {/* Mostrar mensaje de éxito */}
                    {productSuccess && (
                      <div className={styles.successMessage}>
                        Product added successfully to {selectedCompany.name}!
                      </div>
                    )}

                    <form onSubmit={handleProductSubmit}>
                      <div className={styles.formGroup}>
                        <label htmlFor="product-name">Product Name</label>
                        <input
                          type="text"
                          id="product-name"
                          name="name"
                          value={productData.name}
                          onChange={handleProductInputChange}
                          required
                          disabled={productIsSubmitting}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="product-description">Description</label>
                        <textarea
                          id="product-description"
                          name="description"
                          value={productData.description}
                          onChange={handleProductInputChange}
                          required
                          disabled={productIsSubmitting}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="product-price">Price</label>
                        <input
                          type="number"
                          id="product-price"
                          name="price"
                          value={productData.price}
                          onChange={handleProductInputChange}
                          step="0.01"
                          min="0"
                          required
                          disabled={productIsSubmitting}
                        />
                      </div>

                      <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={productIsSubmitting}
                      >
                        {productIsSubmitting
                          ? "Adding Product..."
                          : "Add Product"}
                      </button>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => setShowProductForm(false)}
                        disabled={productIsSubmitting}
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                )}
                {/* Formulario para verificar contraseña */}
                {showPasswordForm && selectedCompany && (
                  <div
                    ref={passwordFormRef}
                    className={styles.passwordVerificationForm}
                  >
                    <h4>Access verification for {selectedCompany.name}</h4>
                    <p className={styles.verificationDescription}>
                      Please enter the company password to access the management
                      area.
                    </p>

                    {/* Mostrar mensajes de error */}
                    {passwordError && (
                      <div className={styles.errorMessage}>{passwordError}</div>
                    )}

                    {/* Mostrar mensaje de éxito */}
                    {passwordSuccess && (
                      <div className={styles.successMessage}>
                        Access verified! Redirecting to management page...
                      </div>
                    )}

                    <form onSubmit={handlePasswordSubmit}>
                      <div className={styles.formGroup}>
                        <label htmlFor="company-password">
                          Company Password
                        </label>
                        <input
                          type="password"
                          id="company-password"
                          name="password"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          required
                          disabled={passwordIsSubmitting}
                          placeholder="Enter the password for this company"
                          autoComplete="off"
                        />
                      </div>

                      <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={passwordIsSubmitting}
                      >
                        {passwordIsSubmitting
                          ? "Verifying..."
                          : "Verify Access"}
                      </button>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => setShowPasswordForm(false)}
                        disabled={passwordIsSubmitting}
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NavBar_Services;
