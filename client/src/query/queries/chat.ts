import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../key";
import { chatApi } from "../../api/chat";

export const useGetChats = () => {
  return useQuery({
    queryKey: queryKeys.chats,
    queryFn: async () => {
      return chatApi.getChats();
    },
  });
};
