import React, { useRef, useEffect, useState, use } from "react";
import styles from "./NavBar_Services.module.css";
import { motion } from "framer-motion";
import { Company } from "../../models/Company";
import { Product } from "../../models/Product";
import { GetAllCompanies } from "../../service/companiesService"; // Importamos el servicio para obtener empresas
import { FollowCompany, getUserById, UnfollowCompany } from "../../service/userService";
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
  // const user = JSON.parse(localStorage.getItem("user") || "{}") as {
  //   _id: string;
  //   company_Followed: FollowedCompany[];
  // };
  const [currentUser, setCurrentUser] = useState<User>();


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

  // Cargar las empresas del usuario cuando se necesiten
  useEffect(() => {
    if (activeSection === "existing") {
      const fetchCompanies = async () => {
        try {
          // En un caso real, esto debería filtrar por el ID del usuario actual
          const companies = await GetAllCompanies();
          setUserCompanies(companies);
        } catch (error) {
          console.error("Error loading companies:", error);
        }
      };

      fetchCompanies();
    }
  }, [activeSection]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const fetchUser = async () => {
      if (!storedUserId) return;
    const user = await getUserById(storedUserId || "");
      setCurrentUser(user || null);
    
    }
    fetchUser();
  }
  , []);
  
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
        console.error(`Error while toggling follow for company ${companyId}:`, error);
        alert("An error occurred while updating your follow status. Please try again.");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Company data submitted:", formData);
    // Here you would typically send the data to your backend
    alert("Company submitted successfully!");
    setFormData({
      name: "",
      description: "",
      location: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) {
      alert("No company selected!");
      return;
    }

    console.log("Product data submitted:", {
      ...productData,
      companyId: selectedCompany._id,
    });

    // Here you would typically send the data to your backend
    alert(`Product added successfully to ${selectedCompany.name}!`);
    setProductData({
      name: "",
      description: "",
      price: 0,
    });
    setShowProductForm(false);
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
        <h1 className={styles.servicesTitle}>Our Services</h1>
        <div className={styles.servicesDescription}>
          <p>
            At QuickFind we offer a wide range of services designed to help you
            find exactly what you need. Our solutions are designed to provide
            the best user experience, with quick and accurate results.
          </p>
        </div>
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
                                  currentUser.company_Followed?.some((followed: FollowedCompany) => followed.company_id === company._id)
                                    ? styles.unfollowButton
                                    : styles.followButton
                               }`}
                               onClick={() => handleFollowToggle(company._id)}
                            >
                              {currentUser.company_Followed?.some((followed: FollowedCompany) => followed.company_id === company._id) ? "UnFollow" : "Follow"}
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
                    <form onSubmit={handleSubmit}>
                      <div className={styles.formGroup}>
                        <label htmlFor="update-name">Company Name</label>
                        <input
                          type="text"
                          id="update-name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
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
                        />
                      </div>

                      <button type="submit" className={styles.submitButton}>
                        Update Company
                      </button>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => setShowUpdateForm(false)}
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
                        />
                      </div>

                      <button type="submit" className={styles.submitButton}>
                        Add Product
                      </button>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => setShowProductForm(false)}
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
