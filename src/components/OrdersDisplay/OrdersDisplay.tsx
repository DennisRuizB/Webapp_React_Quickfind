import React from "react";
import styles from "./OrdersDisplay.module.css";
import { IOrder } from "../../models/Order"; // Asegúrate de que la ruta sea correcta
import { Product } from "../../models/Product"; // Asegúrate de que la ruta sea correcta

interface OrdersDisplayProps {
    orders: IOrder[];
  }

  
  
  const OrdersDisplay: React.FC<OrdersDisplayProps> = ({ orders }) => {
    return (
      <div className={styles.ordersContainer}>
        <h3>Órdenes Recientes</h3>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order._id} className={styles.orderItem}>
                <p>
                  <strong>ID de Orden:</strong> {order._id}
                </p>
                <p>
                  <strong>Productos:</strong>
                </p>
                <ul>
                  {order.products.map((product, index) => (
                    <li key={index}>
                      Nombre: {product.product_id.name}, Cantidad: {product.quantity}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Fecha:</strong> {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Estado:</strong> {order.status}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay órdenes recientes.</p>
        )}
      </div>
    );
  };
  
  export default OrdersDisplay;

  