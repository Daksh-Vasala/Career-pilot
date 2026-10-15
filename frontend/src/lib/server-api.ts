import "server-only";
import axios from "axios";
import { cookies } from "next/headers";
import type { DashboardSummaryResponse } from "@/features/dashboard/dashboard.types";
import type {
  Application,
  ApplicationsResponse,
} from "@/features/applications/application.types";
import type { Job, JobsResponse } from "@/features/jobs/job.types";
import type { Resume, ResumesResponse } from "@/features/resumes/resume.types";
import {
  Interview,
  InterviewsResponse,
} from "@/features/interviews/interview.types";
import { ProfileResponse, UserProfile } from "@/features/profile/profile.types";
import {
  Roadmap,
  RoadmapDetails,
  RoadmapDetailsResponse,
  RoadmapsResponse,
} from "@/features/roadmaps/roadmap.types";

interface CollectionResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}

function getBackendApiUrl() {
  const baseUrl =
    process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("Backend API URL is not configured");
  }

  return baseUrl.replace(/\/+$/, "");
}

export async function getDashboardSummaryServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const response = await axios.get<DashboardSummaryResponse>(
    `${getBackendApiUrl()}/dashboard/summary`,
    {
      headers: {
        Cookie: `token=${token}`,
      },
      timeout: 10000,
    },
  );

  return response.data.data;
}

export async function getRecentApplicationsServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const headers = {
    Cookie: `token=${token}`,
  };

  const [applicationsResponse, jobsResponse] = await Promise.all([
    axios.get<CollectionResponse<Application>>(
      `${getBackendApiUrl()}/applications`,
      { headers, timeout: 10000 },
    ),
    axios.get<CollectionResponse<Job>>(`${getBackendApiUrl()}/jobs`, {
      headers,
      timeout: 10000,
    }),
  ]);

  const applications = applicationsResponse.data.data
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  const jobs = jobsResponse.data.data;

  const jobsById = new Map(jobs.map((job) => [job.id, job]));

  return applications.map((application) => ({
    ...application,
    job: jobsById.get(application.jobId),
  }));
}

export async function getResumesServer(): Promise<Resume[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const response = await axios.get<ResumesResponse>(
    `${getBackendApiUrl()}/resumes`,
    {
      headers: {
        Cookie: `token=${token}`,
      },
      timeout: 10000,
    },
  );

  return response.data.data;
}

export async function getJobsServer(): Promise<Job[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const response = await axios.get<JobsResponse>(`${getBackendApiUrl()}/jobs`, {
    headers: {
      Cookie: `token=${token}`,
    },
    timeout: 10000,
  });

  return response.data.data;
}

export async function getApplicationsPageDataServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const baseUrl = getBackendApiUrl();
  const headers = {
    Cookie: `token=${token}`,
  };

  const [applicationsRes, jobsRes] = await Promise.all([
    axios.get<ApplicationsResponse>(`${baseUrl}/applications`, {
      headers,
      timeout: 10000,
    }),
    axios.get<JobsResponse>(`${baseUrl}/jobs`, {
      headers,
      timeout: 10000,
    }),
  ]);

  return {
    applications: applicationsRes.data.data,
    jobs: jobsRes.data.data,
  };
}

export async function getJobsPageDataServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const baseUrl = getBackendApiUrl();
  const headers = {
    Cookie: `token=${token}`,
  };

  const [jobsResponse, applicationsResponse] = await Promise.all([
    axios.get<JobsResponse>(`${baseUrl}/jobs`, {
      headers,
      timeout: 10000,
    }),
    axios.get<ApplicationsResponse>(`${baseUrl}/applications`, {
      headers,
      timeout: 10000,
    }),
  ]);

  return {
    jobs: jobsResponse.data.data,
    applications: applicationsResponse.data.data,
  };
}

export async function getApplicationDetailsServer(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const baseUrl = getBackendApiUrl();
  const config = {
    headers: { Cookie: `token=${token}` },
    timeout: 10000,
  };

  const [applicationResponse, jobsResponse] = await Promise.all([
    axios.get<{ success: boolean; message: string; data: Application }>(
      `${baseUrl}/applications/${id}`,
      config,
    ),
    axios.get<JobsResponse>(`${baseUrl}/jobs`, config),
  ]);

  const application = applicationResponse.data.data;
  const job = jobsResponse.data.data.find(
    (item) => item.id === application.jobId,
  );

  if (!job) {
    throw new Error("JOB_NOT_FOUND");
  }

  return { application, job };
}

export async function getInterviewsServer(): Promise<Interview[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const baseUrl = getBackendApiUrl();

  const response = await axios.get<InterviewsResponse>(
    `${baseUrl}/interviews`,
    {
      headers: {
        Cookie: `token=${token}`,
      },
      timeout: 10000,
    },
  );

  return response.data.data;
}

export async function getInterviewsPageDataServer() {
  const [interviews, applications, jobs] = await Promise.all([
    getInterviewsServer(),
    getRecentApplicationsServer(),
    getJobsServer(),
  ]);

  return { interviews, applications, jobs };
}

export async function getProfileServer(): Promise<UserProfile> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const baseUrl = getBackendApiUrl();

  const response = await axios.get<ProfileResponse>(`${baseUrl}/profiles`, {
    headers: {
      Cookie: `token=${token}`,
    },
    timeout: 10000,
  });

  return response.data.data;
}

export async function getRoadmapsServer(): Promise<Roadmap[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const baseUrl = getBackendApiUrl();

  const response = await axios.get<RoadmapsResponse>(`${baseUrl}/roadmaps`, {
    headers: {
      Cookie: `token=${token}`,
    },
    timeout: 10000,
  });

  return response.data.data;
}

export async function getRoadmapDetailsServer(
  roadmapId: string,
): Promise<RoadmapDetails> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const baseUrl = getBackendApiUrl();

  const response = await axios.get<RoadmapDetailsResponse>(
    `${baseUrl}/roadmaps/${roadmapId}`,
    {
      headers: {
        Cookie: `token=${token}`,
      },
      timeout: 10000,
    },
  );

  return response.data.data;
}
