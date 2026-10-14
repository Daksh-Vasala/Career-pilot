import { api } from "@/lib/api-client";
import type {
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

export async function createApplication(data: CreateApplicationData) {
  const response = await api.post("/applications", data);
  return response.data.data;
}
