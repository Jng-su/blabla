import axios, { AxiosInstance } from "axios";
import { createRequestInterceptor } from "./requestInterceptor";
import { createResponseInterceptor } from "./responseInterceptor";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

createRequestInterceptor(api);
createResponseInterceptor(api);

export default api;
