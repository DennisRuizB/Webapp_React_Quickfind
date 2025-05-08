import { IOrder, Order } from "../models/Order";
import api from "./axiosInstance";

const apiURL = "http://localhost:4000/api/orders";

export const getOrdersByUserId = async (userId: string): Promise<IOrder[] > => {
  try {
    const response = await api.get(`${apiURL}/AllOrdersByUser/${userId}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch orders");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export const createOrder = async (order: Order): Promise<IOrder> => {
  try {
    const response = await api.post(apiURL, order);
    if (response.status !== 200) {
      throw new Error("Failed to create order");
    }
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}