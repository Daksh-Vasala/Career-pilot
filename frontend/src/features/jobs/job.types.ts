export interface Job {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  jobUrl: string | null;
  location: string | null;
  employmentType: string | null;
  salary: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  success: boolean;
  message: string;
  data: Job[];
}

export interface JobResponse {
  success: boolean;
  message: string;
  data: Job;
}