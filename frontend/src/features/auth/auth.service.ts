import { api } from "@/lib/api-client";

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
  const res = await api.post("/auth/register", data);

  return res.data;
};

export const loginUser = async (data: LoginPayload) => {
  const res = await api.post("/auth/login", data);

  return res.data;
};

export const getUser = async () => {
  const res = await api.get("/auth/me");

  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");

  return res.data;
};
