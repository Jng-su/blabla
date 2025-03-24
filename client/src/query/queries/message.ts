import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../key";
import { messageApi } from "../../api/message";

export const useGetMessages = (chatId: string | null) => {
  return useQuery({
    queryKey: queryKeys.messages(chatId),
    queryFn: () => {
      if (!chatId) return [];
      return messageApi.getMessagesByChatId(chatId);
    },
    enabled: !!chatId,
  });
};
