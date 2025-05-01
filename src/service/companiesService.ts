import { Company } from "../models/Company";
import api from "./axiosInstance";
import { IReview } from "../models/Review";

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

export const ReviewCompany = async (
  review: IReview
): Promise<IReview> => {
  try {
    const response = await api.post<IReview>(`${apiURL}/review/${review.company_id}`, {review});
    if (response.status !== 200) {
      throw new Error("Failed to review company");
    }
    return response.data; // Devuelve los datos del usuario
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

export const getCompanyReviews = async (companyId: string): Promise<IReview[]> => {
  try {
    const response = await api.get<IReview[]>(`${apiURL}/reviews/${companyId}`);
    if (response.status !== 200) {
      throw new Error("Failed to get company reviews");
    }
    return response.data; // Devuelve los datos del usuario
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}


