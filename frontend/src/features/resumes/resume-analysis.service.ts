
import { api } from "@/lib/api-client";
import type {
  ResumeAnalysesResponse,
  ResumeAnalysisResponse,
} from "@/features/resumes/resume-analysise.types";

export async function createResumeAnalysis(
  resumeId: string,
  jobDescription?: string,
) {
  const response = await api.post<ResumeAnalysisResponse>(
    "/ai/resume-analysis",
    { resumeId, ...(jobDescription?.trim() ? { jobDescription: jobDescription.trim() } : {}) },
  );

  return response.data.data;
}

export async function getResumeAnalyses(resumeId: string) {
  const response = await api.get<ResumeAnalysesResponse>(
    "/ai/resume-analysis",
    { params: { resumeId } },
  );

  return response.data.data;
}

export async function getResumeAnalysisById(id: string) {
  const response = await api.get<ResumeAnalysisResponse>(
    `/ai/resume-analysis/${id}`,
  );

  return response.data.data;
}
