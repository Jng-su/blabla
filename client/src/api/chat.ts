import api from "./config/axios";

export const chatApi = {
  getChats: async () => {
    const response = await api.get("/chats");
    return response.data;
  },
};
