import { Company } from "../models/Company";
import axios from "axios";

const apiURL = "http://localhost:4000/api/company";

export const GetAllCompanies = async (): Promise<Company[]> => {
  try {
    const response = await axios.get<Company[]>(`${apiURL}`);
    console.log(response.data);
    if (response.status !== 200) {
      throw new Error("Failed to getCompanies");
    }
    return response.data; // Devuelve los datos del usuario
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};
