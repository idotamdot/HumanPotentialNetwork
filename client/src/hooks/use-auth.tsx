import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  // Fetch the current user
  const { data: user, isLoading, refetch } = useQuery<User>({
    queryKey: ["/api/me"],
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const login = async (username: string, password: string) => {
    try {
      setError(null);
      // In a real app with full authentication implementation, we would:
      // 1. Send credentials to the server
      // 2. Get a token or session
      // 3. Update the user state
      await apiRequest("POST", "/api/login", { username, password });
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to login"));
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      // In a real app with full authentication implementation:
      await apiRequest("POST", "/api/logout", {});
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to logout"));
      throw err;
    }
  };

  // Auto-login effect
  useEffect(() => {
    // Initial auth check on mount
    refetch();
  }, [refetch]);

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
