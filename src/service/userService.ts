import { User } from "../models/User";
import api from "./axiosInstance";

const apiURL = "http://localhost:4000/api/users";

export const logInUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: User; refreshToken: string }> => {
  try {
    const response = await api.post(`${apiURL}/login`, {
      email,
      password,
    });

    if (response.status !== 200) {
      throw new Error("Failed to log in");
    }

    const { token, user, refreshToken } = response.data;

    // Opcional: Almacenar el token y refreshToken en localStorage o cookies
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    // console.log("responseeee:", user);
    return { token, user, refreshToken };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const UpdateProfilePicture = async (email: string, avatar: string): Promise<{user: User; }> => {
  try{
    const response = await api.put(`${apiURL}/uptdateAvatar`, {
      email,
      avatar,
    });

    if (response.status !== 200) {
      throw new Error("Failed to update avatar");
    }

    return response.data;
  }
  catch (error){
    console.error("Error updateing avatar:", error);
    throw error;
  }
}

export const UpdateUserById = async (user: User): Promise<{user: User; }> => {
  try{
    const response = await api.put(`${apiURL}/${user._id}`, {
      user,
    });

    if (response.status !== 200) {
      throw new Error("Failed to update user");
    }

    return response.data;
  }
  catch (error){
    console.error("Error updateing user:", error);
    throw error;
  }
}

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await api.get(`${apiURL}/${id}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch user");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}