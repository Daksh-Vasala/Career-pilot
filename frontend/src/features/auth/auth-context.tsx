"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  type LoginPayload,
  type RegisterPayload,
} from "@/features/auth/auth.service";
import type { AuthUser } from "@/features/auth/auth.types";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<{ message: string }>;
  register: (payload: RegisterPayload) => Promise<{ message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false);

  
  async function refreshUser() {
    try {
      const currentUser = await getUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(payload: LoginPayload) {
    const response = await loginUser(payload);
    setUser(response.data);
    setIsLoading(false);
    return response;
  }

  async function register(payload: RegisterPayload) {
    const response = await registerUser(payload);
    setUser(response.data);
    setIsLoading(false);
    return response;
  }
  
  async function logout() {
    await logoutUser();
    setUser(null);
  }
  useEffect(() => {
    if (hasInitialized.current) return;

    hasInitialized.current = true;
    void refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, refreshUser, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
