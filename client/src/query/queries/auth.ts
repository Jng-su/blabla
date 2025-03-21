import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../key";
import Cookies from "js-cookie";

export const useAuthStatusQuery = () => {
  const initialAuth = !!Cookies.get("access_token");
  return useQuery({
    queryKey: queryKeys.authStatus,
    queryFn: async () => {
      const hasToken = !!Cookies.get("access_token");
      return { isAuthenticated: hasToken };
    },
    staleTime: Infinity,
    initialData: { isAuthenticated: initialAuth },
  });
};
