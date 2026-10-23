
export interface ResumeAnalysisContent {
  summary: string;
  strengths: string[];
  skillsFound: string[];
  recommendations: string[];
  improvementAreas: string[];
  atsReadiness?: AtsReadiness | null;
  atsReadinessError?: string;
}

export interface AtsReadiness {
  score: number;
  explanation: string;
  suggestions: string[];
}

export interface ResumeAnalysis {
  id: string;
  userId: string;
  resumeId: string;
  model: string;
  analysis: ResumeAnalysisContent;
  createdAt: string;
}

export interface ResumeAnalysesResponse {
  success: boolean;
  message: string;
  data: ResumeAnalysis[];
}

export interface ResumeAnalysisResponse {
  success: boolean;
  message: string;
  data: ResumeAnalysis;
}
