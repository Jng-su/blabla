import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../key";
import { userApi } from "../../api/user";

export const useInviteFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => userApi.inviteFriend(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friendsList });
    },
    onError: (error) => {
      console.error("친구 초대 실패:", error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: {
      name?: string;
      profile_image?: string;
      statusMessage?: string;
    }) => userApi.updateUser(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
    onError: (error) => {
      console.error("사용자 수정 실패:", error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => userApi.deleteUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.friendsList });
    },
    onError: (error) => {
      console.error("회원 탈퇴 실패:", error);
    },
  });
};

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (friendId: string) => userApi.removeFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friendsList });
    },
    onError: (error) => {
      console.error("친구 삭제 실패:", error);
    },
  });
};
