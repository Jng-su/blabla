import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../api/auth";
import { queryKeys } from "../key";

export const useSignInMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      authApi.signIn(data),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.authStatus, { isAuthenticated: true });
    },
  });
};

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      authApi.signUp(data),
  });
};

export const useSignOutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.authStatus, {
        isAuthenticated: false,
      });
    },
  });
};
