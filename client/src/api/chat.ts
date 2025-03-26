import { Chat } from "../types/chat";
import api from "./config/axios";

export const chatApi = {
  getChats: async (): Promise<Chat[]> => {
    const response = await api.get("/chats");
    return response.data;
  },
};
