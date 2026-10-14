export interface DashboardSummary {
  resumes: {
    total: number;
  };
  resumeAnalyses: {
    total: number;
  };
  applications: {
    total: number;
    byStatus: {
      APPLIED: number;
      INTERVIEW: number;
      OFFER: number;
      ACCEPTED: number;
      REJECTED: number;
      WITHDRAWN: number;
    };
  };
  interviews: {
    total: number;
    upcoming: number;
    nextInterview: {
      id: string;
      scheduledAt: string;
      interviewType: string;
      interviewerName: string | null;
    } | null;
  };
}

export interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: DashboardSummary;
}
