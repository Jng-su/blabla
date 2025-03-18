import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_APP_ENV === "production"
      ? import.meta.env.VITE_API_URL
      : "/api/v1",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
