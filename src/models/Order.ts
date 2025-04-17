
// Definición de la interfaz IPedido
export interface IOrder {
  _id: string;
  user_id: string;
  products: {
    product_id: string;
    quantity: number;
    //unit_price: number;
  }[];
  orderDate: Date;
  status: string;
}
