import { api } from "@/lib/api-client";
import type { ResumesResponse } from "@/features/resumes/resume.types";

export async function getResumes() {
  const response = await api.get<ResumesResponse>("/resumes");
  return response.data.data;
}

export async function deleteResume(id: string) {
  const response = await api.delete(`/resumes/${id}`);
  return response.data;
}

export async function uploadResume(title: string, file: File) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("file", file);

  const response = await api.post("/resumes", formData, {
    headers: {
      "Content-Type": undefined,
    },
  });

  return response.data;
}
