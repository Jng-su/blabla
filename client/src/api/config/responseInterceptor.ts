import { AxiosInstance } from "axios";
import Cookies from "js-cookie";

export const createResponseInterceptor = (api: AxiosInstance) => {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = Cookies.get("refresh_token");
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }
          const { data } = await api.post(
            "/auth/refresh",
            { refreshToken },
            { headers: { Authorization: `Bearer ${refreshToken}` } }
          );

          Cookies.set("access_token", data.access_token);
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      }

      console.error("Response error:", error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
};
