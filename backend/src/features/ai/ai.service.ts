import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { resumes } from "../../db/schema/resume.ts";
import { ApiError } from "../../utils/api-error.ts";
import {
  analyzeResumeWithGemini,
  assessAtsReadinessWithGemini,
} from "./providers/gemini.provider.ts";
import { resumeAnalyses } from "../../db/schema/resume-analysis.ts";

export const analyzeResumeService = async (
  userId: string,
  resumeId: string,
  jobDescription?: string,
) => {
  const [resume] = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  if (!resume.extractedText?.trim()) {
    throw new ApiError(422, "Resume has no extracted text for analysis");
  }

  const analysis = await analyzeResumeWithGemini(resume.extractedText);
  let atsReadiness = null;
  let atsReadinessError: string | undefined;

  try {
    atsReadiness = await assessAtsReadinessWithGemini(
      resume.extractedText,
      jobDescription,
    );
  } catch {
    atsReadinessError =
      "ATS readiness estimate is unavailable right now. Your resume analysis was saved successfully.";
  }

  const [savedAnalysis] = await db
    .insert(resumeAnalyses)
    .values({
      userId,
      resumeId,
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      analysis: {
        ...analysis,
        atsReadiness,
        ...(atsReadinessError ? { atsReadinessError } : {}),
      },
    })
    .returning();

  if (!savedAnalysis) {
    throw new ApiError(404, "Failed to save resume analysis");
  }

  return savedAnalysis;
};

export const getResumeAnalysisByIdService = async (
  resumeAnalysisId: string,
  userId: string,
) => {
  const [resumeAnalysis] = await db
    .select()
    .from(resumeAnalyses)
    .where(
      and(
        eq(resumeAnalyses.id, resumeAnalysisId),
        eq(resumeAnalyses.userId, userId),
      ),
    );

  if (!resumeAnalysis) {
    throw new ApiError(404, "Resume analysis not found");
  }

  return resumeAnalysis;
};

export const getResumeAnalysesByResumeIdService = async (
  resumeId: string,
  userId: string,
) => {
  const [resume] = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return await db
    .select()
    .from(resumeAnalyses)
    .where(
      and(
        eq(resumeAnalyses.resumeId, resumeId),
        eq(resumeAnalyses.userId, userId),
      ),
    )
    .orderBy(desc(resumeAnalyses.createdAt));
};
