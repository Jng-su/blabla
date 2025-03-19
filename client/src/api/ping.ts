import api from "../config/axios";
import { PingResponse } from "../interfaces/api/ping";

export const pingApi = {
  getPing: async (): Promise<PingResponse> => {
    const response = await api.get("/ping");
    return response.data;
  },
};
