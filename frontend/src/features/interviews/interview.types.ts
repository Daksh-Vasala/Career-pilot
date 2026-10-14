export type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export type InterviewType =
  | "TECHNICAL"
  | "HR"
  | "BEHAVIORAL"
  | "MANAGERIAL"
  | "GROUP_DISCUSSION"
  | "OTHER";

export interface Interview {
  id: string;
  userId: string;
  applicationId: string;
  scheduledAt: string | null;
  interviewType: InterviewType | null;
  status: InterviewStatus;
  interviewerName: string | null;
  meetingLink: string | null;
  notes: string | null;
  feedback: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewsResponse {
  success: boolean;
  message: string;
  data: Interview[];
}

export interface InterviewResponse {
  success: boolean;
  message: string;
  data: Interview;
}