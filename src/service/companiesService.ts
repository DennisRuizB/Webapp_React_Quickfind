import { Company } from "../models/Company";
import api from "./axiosInstance";

const apiURL = "http://localhost:4000/api/company";

export const GetAllCompanies = async (): Promise<Company[]> => {
  try {
    const response = await api.get<Company[]>(`${apiURL}`);
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

export const GetCompanyById = async (id: string): Promise<Company> => {
  try {
    const response = await api.get<Company>(`${apiURL}/${id}/products`);
    if (response.status !== 200) {
      throw new Error("Failed to getCompanyById");
    }
    return response.data; // Devuelve los datos del usuario
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const RateCompany = async (
  companyId: string,
  rating: number
): Promise<Company> => {
  try {
    const response = await api.put<Company>(`${apiURL}/rate/${companyId}`, {
      rating,
    });
    if (response.status !== 200) {
      throw new Error("Failed to rate company");
    }
    return response.data; // Devuelve los datos del usuario
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

