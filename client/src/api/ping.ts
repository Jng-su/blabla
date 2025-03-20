import api from "../config/axios";

export const pingApi = {
  getPing: async (): Promise<string> => {
    const response = await api.get("/ping");
    return response.data;
  },
};
