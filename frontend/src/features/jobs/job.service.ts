import { api } from "@/lib/api-client";
import type {
  Job,
  JobResponse,
  JobsResponse,
} from "@/features/jobs/job.types";

export interface CreateJobData {
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  location?: string;
  employmentType?: string;
  salary?: string;
  description?: string;
}

export type UpdateJobData = Omit<
  Partial<CreateJobData>,
  "jobUrl" | "location" | "employmentType" | "salary" | "description"
> & {
  jobUrl?: string | null;
  location?: string | null;
  employmentType?: string | null;
  salary?: string | null;
  description?: string | null;
};

export async function getJobs(): Promise<Job[]> {
  const response = await api.get<JobsResponse>("/jobs");
  return response.data.data;
}

export async function createJob(data: CreateJobData): Promise<Job> {
  const response = await api.post<JobResponse>("/jobs", data);
  return response.data.data;
}

export async function updateJob(
  id: string,
  data: UpdateJobData
): Promise<Job> {
  const response = await api.patch<JobResponse>(`/jobs/${id}`, data);
  return response.data.data;
}

export async function deleteJob(id: string) {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
}