import React from "react";
import styles from "./ProductsDisplay.module.css";

interface Product {
  name: string;
  price: number;
  description?: string;
}

interface ProductsDisplayProps {
  products: Product[]; // Lista de productos a mostrar
}

const ProductsDisplay: React.FC<ProductsDisplayProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return <p className={styles.noProducts}>No hay productos disponibles.</p>;
  }

  return (
    <div className={styles.productsContainer}>
      <h3 className={styles.title}>Productos</h3>
      <ul className={styles.productList}>
        {products.map((product, index) => (
          <li key={index} className={styles.productItem}>
            <div className={styles.productHeader}>
              <strong className={styles.productName}>{product.name}</strong>
              <span className={styles.productPrice}>${product.price.toFixed(2)}</span>
            </div>
            {product.description && (
              <p className={styles.productDescription}>{product.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsDisplay;