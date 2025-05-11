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
  const [products, setProducts] = useState<{ companyId: string; products: Product[] }[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
    // Cargar productos desde localStorage
    const storedData = JSON.parse(localStorage.getItem("products") || "[]");
  
    // Verificar si storedData es un array
    if (!Array.isArray(storedData)) {
      console.error("Invalid data format in localStorage. Expected an array.");
      return;
    }
  
    // Agrupar productos por companyId y consolidar cantidades
    const consolidatedData: { companyId: string; products: Product[] }[] = [];
  
    storedData.forEach((entry: any) => {
      const { companyId, products } = entry;
  
      // Buscar si ya existe una entrada para esta empresa
      let companyEntry = consolidatedData.find((data) => data.companyId === companyId);
  
      if (!companyEntry) {
        companyEntry = { companyId, products: [] };
        consolidatedData.push(companyEntry);
      }
  
      // Consolidar productos repetidos dentro de la misma empresa
      products.forEach((product: any) => {
        // Verificar explícitamente que companyEntry no sea undefined
        if (companyEntry) {
          const existingProduct = companyEntry.products.find((p) => p._id === product._id);
          if (existingProduct) {
            existingProduct.quantity += product.quantity || 1;
          } else {
            companyEntry.products.push({ ...product, quantity: product.quantity || 1 });
          }
        }
      });
    });
  
    // Actualizar el estado con los productos consolidados
    setProducts(consolidatedData);
  
    // Calcular el precio total
    const total = consolidatedData.reduce((sum, entry) => {
      return (
        sum +
        entry.products.reduce((subSum, product) => subSum + product.price * product.quantity, 0)
      );
    }, 0);
    setTotalPrice(total);
  }, []);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedProducts = [...products];
    const productIndex = updatedProducts[index].products.findIndex((p) => p._id === products[index].products[0]._id);
    if (productIndex !== -1) {
      updatedProducts[index].products[productIndex].quantity = newQuantity;
    }
    setProducts(updatedProducts);

    // Recalcular el precio total
    const total = updatedProducts.reduce(
      (sum, entry) =>
        sum +
        entry.products.reduce(
          (subSum, product) => subSum + product.price * product.quantity,
          0
        ),
      0
    );
    setTotalPrice(total);

    // Actualizar localStorage
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleCheckout = async () => {
    try {
      // Iterar sobre cada empresa y crear una orden
      for (const entry of products) {
        const { companyId, products } = entry;
  
        const orderData: Order = {
          user_id: localStorage.getItem("userId") || "", // Replace with actual user ID
          orderDate: new Date().toISOString(),
          status: "Pendiente", // Replace with appropriate status
          company_id: companyId,
          products: products.map((product) => ({
            product_id: product._id,
            quantity: product.quantity,
          })),
        };
        console.log("Order data:", orderData);
        // Llamar al servicio para crear la orden
        const response = await createOrder(orderData);
        console.log(`Order created for company ${companyId}:`, response);
      }
  
      // Limpiar el carrito después de crear las órdenes
      localStorage.removeItem("products");
      setProducts([]);
      setTotalPrice(0);
  
      alert("Orders created successfully!");
    } catch (error) {
      console.error("Error creating orders:", error);
      alert("Failed to create orders. Please try again.");
    }
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
          {products.map((entry, idx) => (
            <div key={idx}>
              <h3>Company ID: {entry.companyId}</h3>
              {entry.products.map((product, productIdx) => (
                <div key={productIdx} className={styles.productCard}>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;