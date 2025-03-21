import { useCallback } from "react";
import { authApi } from "../../api/auth";

export const useSignOut = (setIsAuthenticated: (value: boolean) => void) => {
  const signOut = useCallback(async () => {
    try {
      await authApi.signOut();
      setIsAuthenticated(false);
      console.log("isAuthenticated set to false");
    } catch (err) {
      if (err instanceof Error) {
        console.error(
          "SignOut failed:",
          (err as any).response?.data || err.message
        );
      } else {
        console.error("SignOut failed:", err);
      }
      throw err;
    }
  }, [setIsAuthenticated]);

  return { signOut };
};
