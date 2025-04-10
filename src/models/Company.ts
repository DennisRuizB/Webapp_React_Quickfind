import { Product } from "./Product";

export interface Company {
  _id: string;
  name: string;
  rating: number;
  description: string;
  location: string;
  email: string;
  phone: string;
  password: string;
  wallet: number;
  coordenates_lat: number;
  coordenates_lng: number;
  products: Product[];
}
