import { useCallback } from "react";
import { authApi } from "../../api/auth";

export const useSignIn = (setIsAuthenticated: (value: boolean) => void) => {
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await authApi.signIn({ email, password });
        console.log("SignIn response:", response);
        setIsAuthenticated(true);
        console.log("isAuthenticated set to true");
      } catch (err) {
        if (err instanceof Error) {
          console.error(
            "SignIn failed:",
            (err as any).response?.data || err.message
          );
        } else {
          console.error("SignIn failed:", err);
        }
        throw err;
      }
    },
    [setIsAuthenticated]
  );

  return { signIn };
};
