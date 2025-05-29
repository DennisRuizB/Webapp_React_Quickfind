import React from "react";
import styles from "./OrdersDisplay.module.css";
import { IOrder } from "../../../models/Order";

interface OrdersDisplayProps {
  orders: IOrder[];
}

const OrdersDisplay: React.FC<OrdersDisplayProps> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className={styles.ordersContainer}>
        <h3>Órdenes Recientes</h3>
        <p>No hay órdenes recientes.</p>
      </div>
    );
  }

  return (
    <div className={styles.ordersContainer}>
      <h3>Órdenes Recientes</h3>
      <ul className={styles.orderList}>
        {orders.map((order) => (
          <li key={order._id} className={styles.orderItem}>
            <div className={styles.orderDetails}>
              <p><strong>ID de Orden:</strong> {order._id}</p>

              {order.products?.length > 0 && (
                <>
                  <p><strong>Productos:</strong></p>
                  <ul className={styles.orderProducts}>
                    {order.products.map((product) => (
                      <li key={product.product_id._id}>
                        Nombre: {product.product_id.name}, Cantidad: {product.quantity}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <p><strong>Fecha:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
              <p><strong>Estado:</strong> {order.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersDisplay;
