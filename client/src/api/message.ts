import api from "./config/axios";

export const messageApi = {
  getMessagesByChatId: async (chatId: string) => {
    const response = await api.get(`/message/${chatId}/messages`);
    return response.data.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  },
};
