import { api } from "@/lib/api-client";
import type {
  Application,
  ApplicationsResponse,
  ApplicationStatus,
} from "@/features/applications/application.types";

export async function getApplications() {
  const response = await api.get<ApplicationsResponse>("/applications");
  return response.data.data;
}

export interface CreateApplicationData {
  jobId: string;
  status?: ApplicationStatus;
  appliedAt?: string | null;
  notes?: string | null;
  recruiterName?: string | null;
  recruiterEmail?: string | null;
}

export type UpdateApplicationData = Partial<
  Omit<CreateApplicationData, "jobId">
>;

export async function createApplication(data: CreateApplicationData) {
  const response = await api.post("/applications", data);
  return response.data.data;
}

export async function getApplicationById(id: string) {
  const response = await api.get<{ data: Application }>(
    `/applications/${id}`,
  );
  return response.data.data;
}

export async function updateApplication(
  id: string,
  data: UpdateApplicationData,
) {
  const response = await api.patch<{ data: Application }>(
    `/applications/${id}`,
    data,
  );
  return response.data.data;
}

export async function deleteApplication(id: string) {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
}
