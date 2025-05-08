import React, { useState, useEffect, use } from "react";
import styles from "./ReserveProducts.module.css";
import { Product } from "../../models/Product";
import { Company } from "../../models/Company";
import { GetCompanyById } from "../../service/companiesService";
import { createOrder } from "../../service/orderService";
import { create } from "domain";
import { IOrder } from "../../models/Order";
import { useParams } from "react-router-dom";

// interface ReserveProductsProps {
//   companyId: string;
//   //onReserve: (productId: string) => void;
// }

const ReserveProducts: React.FC = ({
//   companyId,
  //onReserve,
}) => {
  const { id } = useParams<{ id: string }>(); 
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderedProducts, setOrderedProducts] = useState<Product[]>([]);
  const handleReserve = (productId: string) => {
    setSelectedProduct(productId);
    onReserve(productId);
    alert(`Product with ID ${productId} reserved successfully!`);
  };


  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!id) {
          console.error("Company ID is not provided.");
            return;
        }
        const company: Company = await GetCompanyById(id);
        setProducts(company.products);
        setCompany(company);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCompany();
  }
    , [id]);

    const pushToOrderedProducts = (product: Product) => {
        setOrderedProducts((prev) => [...prev, product]);
    }

    const onReserve = async (productId: string) => {
      try {
        if (!company) {
          console.error("Company data is not loaded.");
          return;
        }
    
        const selectedProduct = products.find((product) => product._id === productId);
    
        if (!selectedProduct) {
          console.error("Product not found.");
          return;
        }
    
        // Obtener los productos existentes en localStorage
        const storedproducts = JSON.parse(localStorage.getItem("products") || "[]");
    
        // Añadir el producto seleccionado a la lista
        storedproducts.push(selectedProduct);
    
        // Guardar la lista actualizada en localStorage
        localStorage.setItem("products", JSON.stringify(storedproducts));
    
        alert(`Product ${selectedProduct.name} added to cart!`);
      } catch (error) {
        console.error("Error adding product to cart:", error);
        alert("Failed to add the product to the cart. Please try again.");
      }
    };

  if (!company) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.reserveWrapper}>
      <h1>Reserve Products from {company.name}</h1>
      <div className={styles.productsContainer}>
        {products.map((product) => (
          <div key={product._id} className={styles.productCard}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>
              <strong>Price:</strong> {product.price}€
            </p>
            <button
              className={styles.reserveButton}
              onClick={() => handleReserve(product._id)}
              //disabled={!product.available}
            >
              {product.available ? "Reserve" : "Not Available"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReserveProducts;