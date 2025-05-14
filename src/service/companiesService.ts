import { Company } from "../models/Company";
import api from "./axiosInstance";
import { Product } from "../models/Product";
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

export const UpdateCompanyById = async (
  companyId: string,
  companyData: any
): Promise<Company> => {
  try {
    const response = await api.put(`${apiURL}/${companyId}`, companyData);

    if (response.status !== 200) {
      throw new Error("Failed to update company");
    }

    return response.data;
  } catch (error: any) {
    // Manejar error específico de email duplicado
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "El email ya está registrado"
    ) {
      throw new Error("El email ya está registrado");
    }
    console.error("Error updating company:", error);
    throw error;
  }
};

export const CreateProduct = async (productData: any): Promise<Product> => {
  try {
    const completeProductData = {
      ...productData,
      rating: 0, // Añadir el rating como campo con valor 0
    };
    const response = await api.post(
      `http://localhost:4000/api/products`,
      completeProductData
    );

    if (response.status !== 201 && response.status !== 200) {
      throw new Error("Failed to create product");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error creating product:", error);
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

// Función para añadir un producto a una empresa
export const AddProductToCompany = async (
  companyId: string,
  productId: string
): Promise<Company> => {
  try {
    const response = await api.put(`${apiURL}/${companyId}/addProduct`, {
      productId,
    });

    if (response.status !== 200) {
      throw new Error("Failed to add product to company");
    }

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error adding product to company:", error);
    throw error;
  }
};

export const GetUserCompanies = async (userId: string): Promise<Company[]> => {
  try {
    // NOTA: Aquí está la URL que podría necesitar corrección
    // Debería ser /api/users/companies/:id o /api/companies/:id según tu backend
    const response = await api.get<Company[]>(
      `http://localhost:4000/api/users/companies/${userId}`
    );

    if (response.status !== 200) {
      throw new Error("Failed to get user companies");
    }

    return response.data;
  } catch (error) {
    console.error("Error getting user companies:", error);
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
};

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
};

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
};

export const AddCompany = async (
  companyData: any
): Promise<Company> => {
  try {
    const response = await api.post<Company>(`${apiURL}`, companyData);
    if (response.status !== 200) {
      throw new Error("Failed to add company");
    }
    return response.data; // Devuelve los datos del usuario
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}