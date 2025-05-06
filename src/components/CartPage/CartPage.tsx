import React, { useState, useEffect } from "react";
import styles from "./CartPage.module.css";
import { IOrder } from "../../models/Order";

interface ConsolidatedProduct {
  product_id: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
  };
  quantity: number;
}

const CartPage: React.FC = () => {
  const [products, setProducts] = useState<ConsolidatedProduct[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    // Cargar productos desde localStorage
    const storedproducts = JSON.parse(localStorage.getItem("products") || "[]");

    // Consolidar productos repetidos
    const consolidatedProducts: ConsolidatedProduct[] = [];
    storedproducts.forEach((product: any) => {
      const existingProduct = consolidatedProducts.find(
        (p) => p.product_id._id === product._id
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        consolidatedProducts.push({
          product_id: {
            _id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image || "",
            category: product.category || "",
            stock: product.stock || 0,
          },
          quantity: 1,
        });
      }
    });

    setProducts(consolidatedProducts);

    // Calcular el precio total
    const total = consolidatedProducts.reduce(
      (sum, product) => sum + product.product_id.price * product.quantity,
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
      (sum, product) => sum + product.product_id.price * product.quantity,
      0
    );
    setTotalPrice(total);

    // Actualizar localStorage
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleCheckout = () => {
    // Crear la estructura de la orden
    const order: IOrder = {
      _id: "temp-id", // Temporary ID, replace with actual ID generation logic if needed
      status: "pending", // Default status for the order
      user_id: localStorage.getItem("userId") || "guest", // ID del usuario o "guest" si no está autenticado
      products: products.map((product) => ({
        product_id: {
          _id: product.product_id._id,
          name: product.product_id.name,
          description: product.product_id.description,
          price: product.product_id.price,
          image: product.product_id.image,
          category: product.product_id.category,
          stock: product.product_id.stock,
        },
        quantity: product.quantity,
      })),
      orderDate: new Date(), // Fecha actual
      //totalPrice: totalPrice, // Precio total calculado
    };
    //eliminar los productos del localStorage
    localStorage.removeItem("products");

    // Imprimir la orden en la consola
    console.log("Order created:", order);

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
                <strong>Name:</strong> {product.product_id.name}
              </p>
              <p>
                <strong>Price:</strong> {product.product_id.price}€
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
                {(product.product_id.price * product.quantity).toFixed(2)}€
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;