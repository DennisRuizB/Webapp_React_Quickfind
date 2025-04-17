import { Product } from "./Product";

export interface Company {
  _id: string;
  name: string;
  rating: number;
  userRatingsTotal: number;
  description: string;
  location: string;
  email: string;
  phone: string;
  password: string;
  wallet: number;
  products: string[];
  coordenates_lat: number;
  coordenates_lng: number;
  icon: string;
  photos?: string[];
}
