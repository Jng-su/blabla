import { AxiosInstance } from "axios";
import Cookies from "js-cookie";

export const createRequestInterceptor = (api: AxiosInstance) => {
  api.interceptors.request.use(
    (config) => {
      const token = Cookies.get("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
