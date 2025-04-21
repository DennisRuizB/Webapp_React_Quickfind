import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // Base URL de tu API
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtén el token del almacenamiento
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Añade el token al encabezado
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken"); // Obtén el refresh token
        if (refreshToken) {
          try {
            // Solicita un nuevo token usando el refresh token
            const { data } = await axios.post("http://localhost:4000/api/users/auth/refresh", {
              refreshToken,
            });
            console.log("e:", data );

            // Guarda el nuevo token en localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);

            // Actualiza el encabezado de la solicitud original con el nuevo token
            error.config.headers["Authorization"] = `Bearer ${data.token}`;

            // Reintenta la solicitud original
            return api(error.config);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login"; // Redirige al login
          } 
        } else {
            // Si falla la renovación, elimina los tokens y redirige al login
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login"; // Redirige al login
          }
      } else if (error.response?.status === 410) {
        // Manejo de error 403 (Forbidden)
        console.error("Access forbidden:", error.response.data.message);
        //window.location.href = "/login"; // Redirige al login
      }
        return Promise.reject(error);
    }
);

export default api;