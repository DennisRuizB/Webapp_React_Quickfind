import React, { useState, useEffect } from "react";
import styles from "./CartPage.module.css";
import { IOrder, Order } from "../../models/Order";
import { Product } from "../../models/Product";
import { create } from "domain";
import { createOrder } from "../../service/orderService";

interface ConsolidatedProduct {
  product_id: {
    _id: string;
    name: string;
    description: string;
    price: number;
    //image: string;
    //category: string;
    //stock: number;
  };
  quantity: number;
}

const CartPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    // Cargar productos desde localStorage
    const storedproducts = JSON.parse(localStorage.getItem("products") || "[]");

    // Consolidar productos repetidos
    const consolidatedProducts: Product[] = [];
    storedproducts.forEach((product: any) => {
      const existingProduct = consolidatedProducts.find(
        (p) => p._id === product._id
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        consolidatedProducts.push({
            ...product,
            quantity: 1, // Añade la propiedad quantity
          });
    }
    });

    setProducts(consolidatedProducts);

    // Calcular el precio total
    const total = consolidatedProducts.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    setTotalPrice(total);
  }, []);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity = newQuantity;
    setProducts(updatedProducts);

    // Recalcular el precio total
    const total = updatedProducts.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    setTotalPrice(total);

    // Actualizar localStorage
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleCheckout = () => {
  // Crear la estructura de la orden
  const order: Order = {
    user_id: localStorage.getItem("userId") || "guest", // ID del usuario o "guest" si no está autenticado
    products: products.map((product) => ({
      product_id: product._id, // Solo el ID del producto
      quantity: product.quantity, // Cantidad del producto
    })),
    status: "Pendiente", // Estado de la orden
    orderDate: new Date().toISOString(), // Fecha actual en formato ISO
  };

  // Imprimir la orden en la consola
  console.log("Order created:", order);
  createOrder(order);

  // Eliminar los productos del localStorage
  localStorage.removeItem("products");

  alert("Order created! Check the console for details.");
};
  return (
    <div className={styles.cartWrapper}>
      <div className={styles.cartContainer}>
        {/* Resumen del carrito */}
        <div className={styles.cartSummary}>
          <h2>Cart Summary</h2>
          <p>
            <strong>Total Price:</strong> {totalPrice.toFixed(2)}€
          </p>
          <button className={styles.checkoutButton} onClick={handleCheckout}>
            Proceed to Payment
          </button>
        </div>

        {/* Listado de productos */}
        <div className={styles.productList}>
          <h2>Products</h2>
          {products.map((product, idx) => (
            <div key={idx} className={styles.productCard}>
              <p>
                <strong>Name:</strong> {product.name}
              </p>
              <p>
                <strong>Price:</strong> {product.price}€
              </p>
              <p>
                <strong>Quantity:</strong>{" "}
                <input
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) =>
                    handleQuantityChange(idx, parseInt(e.target.value, 10))
                  }
                  className={styles.quantityInput}
                />
              </p>
              <p>
                <strong>Total:</strong>{" "}
                {(product.price * product.quantity).toFixed(2)}€
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;