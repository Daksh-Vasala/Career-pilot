export interface Resume {
  id: string;
  title: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  publicId: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumesResponse {
  success: boolean;
  message: string;
  data: Resume[];
}
