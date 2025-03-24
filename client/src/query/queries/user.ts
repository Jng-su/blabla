import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../key";
import { userApi } from "../../api/user";

export const useGetMe = () => {
  return useQuery({
    queryKey: queryKeys.myInfo,
    queryFn: userApi.getMe,
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: userApi.getAllUsers,
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => userApi.getUserByUserId(userId),
    enabled: !!userId,
  });
};

export const useGetFriends = () => {
  return useQuery({
    queryKey: queryKeys.friendsList,
    queryFn: userApi.getFriendsByUserId,
  });
};
