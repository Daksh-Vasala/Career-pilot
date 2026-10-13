import { api } from "@/lib/api-client";
import type { AuthUser } from "./auth.types";

interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const res = await api.post<AuthResponse>("/auth/register", data);

  return res.data;
};

export const loginUser = async (data: LoginPayload) => {
  const res = await api.post<AuthResponse>("/auth/login", data);

  return res.data;
};

export const getUser = async () => {
  const res = await api.get<AuthResponse>("/auth/me");

  return res.data.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");

  return res.data;
};
