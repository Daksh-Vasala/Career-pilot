
import { api } from "@/lib/api-client";
import type {
  ProfileResponse,
  UpdateProfileData,
  UserProfile,
} from "@/features/profile/profile.types";

export async function getProfile(): Promise<UserProfile> {
  const response = await api.get<ProfileResponse>("/profiles");
  return response.data.data;
}

export async function updateProfile(
  data: UpdateProfileData,
): Promise<UserProfile> {
  const response = await api.patch<ProfileResponse>("/profiles", data);
  return response.data.data;
}
