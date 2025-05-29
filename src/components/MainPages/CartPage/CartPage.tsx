import React, { useState, useEffect } from "react";
import styles from "./CartPage.module.css";
import { Order } from "../../../models/Order";
import { Product } from "../../../models/Product";
import { createOrder } from "../../../service/orderService";

const CartPage: React.FC = () => {
  const [products, setProducts] = useState<{ companyId: string; products: Product[] }[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const storedData: { companyId: string; products: Product[] }[] =
      JSON.parse(localStorage.getItem("products") || "[]");

    if (!Array.isArray(storedData)) {
      console.error("Invalid data format in localStorage. Expected an array.");
      return;
    }

    const consolidatedData: { companyId: string; products: Product[] }[] = [];

    storedData.forEach((entry) => {
      const { companyId, products } = entry;

      let companyEntry = consolidatedData.find((data) => data.companyId === companyId);

      if (!companyEntry) {
        companyEntry = { companyId, products: [] };
        consolidatedData.push(companyEntry);
      }

      products.forEach((product) => {
        const existingProduct = companyEntry!.products.find((p) => p._id === product._id);
        if (existingProduct) {
          existingProduct.quantity += product.quantity || 1;
        } else {
          companyEntry!.products.push({ ...product, quantity: product.quantity || 1 });
        }
      });
    });

    setProducts(consolidatedData);
    calculateTotal(consolidatedData);
  }, []);

  const calculateTotal = (productGroups: typeof products) => {
    const total = productGroups.reduce(
      (sum, entry) =>
        sum +
        entry.products.reduce(
          (subSum, product) => subSum + product.price * product.quantity,
          0
        ),
      0
    );
    setTotalPrice(total);
  };

  const handleQuantityChange = (
    companyIndex: number,
    productIndex: number,
    newQuantity: number
  ) => {
    const updatedProducts = [...products];
    updatedProducts[companyIndex].products[productIndex].quantity = newQuantity;

    setProducts(updatedProducts);
    calculateTotal(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleCheckout = async () => {
    try {
      for (const entry of products) {
        const { companyId, products } = entry;

        const orderData: Order = {
          user_id: localStorage.getItem("userId") || "",
          orderDate: new Date().toISOString(),
          status: "Pendiente",
          company_id: companyId,
          products: products.map((product) => ({
            product_id: product._id,
            quantity: product.quantity,
          })),
        };

        const response = await createOrder(orderData);
        console.log(`Order created for company ${companyId}:`, response);
      }

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
        <div className={styles.cartSummary}>
          <h2>Cart Summary</h2>
          <p>
            <strong>Total Price:</strong> {totalPrice.toFixed(2)}€
          </p>
          <button className={styles.checkoutButton} onClick={handleCheckout}>
            Proceed to Payment
          </button>
        </div>

        <div className={styles.productList}>
          <h2>Products</h2>
          {products.map((entry, companyIdx) => (
            <div key={companyIdx}>
              <h3>Company ID: {entry.companyId}</h3>
              {entry.products.map((product, productIdx) => (
                <div key={product._id} className={styles.productCard}>
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
                        handleQuantityChange(
                          companyIdx,
                          productIdx,
                          parseInt(e.target.value, 10)
                        )
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
