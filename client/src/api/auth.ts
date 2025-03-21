import api from "./config/axios";
import Cookies from "js-cookie";

export const authApi = {
  // 로그인
  signIn: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/signin", data);
    Cookies.set("access_token", response.data.access_token);
    Cookies.set("refresh_token", response.data.refresh_token);
    return response.data;
  },

  // 회원가입
  signUp: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  // 로그아웃
  signOut: async () => {
    const response = await api.post("/auth/signout");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    return response.data;
  },
};
