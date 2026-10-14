import { api } from "@/lib/api-client";
import type {
  Interview,
  InterviewsResponse,
  InterviewResponse,
  InterviewStatus,
  InterviewType,
} from "@/features/interviews/interview.types";

export interface CreateInterviewData {
  applicationId: string;
  status?: InterviewStatus;
  interviewType?: InterviewType;
  scheduledAt?: string;
  interviewerName?: string;
  meetingLink?: string;
  notes?: string;
  feedback?: string;
}

export type UpdateInterviewData = Partial<
  Omit<
    CreateInterviewData,
    | "applicationId"
    | "interviewType"
    | "scheduledAt"
    | "interviewerName"
    | "meetingLink"
    | "notes"
    | "feedback"
  >
> & {
  interviewType?: InterviewType | null;
  scheduledAt?: string | null;
  interviewerName?: string | null;
  meetingLink?: string | null;
  notes?: string | null;
  feedback?: string | null;
};

export async function getInterviews(): Promise<Interview[]> {
  const response = await api.get<InterviewsResponse>("/interviews");
  return response.data.data;
}

export async function createInterview(
  data: CreateInterviewData,
): Promise<Interview> {
  const response = await api.post<InterviewResponse>("/interviews", data);
  return response.data.data;
}

export async function updateInterview(
  id: string,
  data: UpdateInterviewData,
): Promise<Interview> {
  const response = await api.patch<InterviewResponse>(
    `/interviews/${id}`,
    data,
  );
  return response.data.data;
}

export async function deleteInterview(id: string): Promise<Interview> {
  const response = await api.delete<InterviewResponse>(`/interviews/${id}`);
  return response.data.data;
}