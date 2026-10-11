import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { applications } from "../../db/schema/application.ts";
import {
  CreateInterviewInput,
  UpdateInterviewInput,
} from "./interview.validation.ts";
import { ApiError } from "../../utils/api-error.ts";
import { interviews } from "../../db/schema/interview.ts";

export const createInterviewService = async (
  userId: string,
  data: CreateInterviewInput,
) => {
  const [application] = await db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.id, data.applicationId),
        eq(applications.userId, userId),
      ),
    );

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  const { scheduledAt, ...rest } = data;

  const [interview] = await db
    .insert(interviews)
    .values({
      ...rest,
      userId,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    })
    .returning();

  if (!interview) {
    throw new ApiError(500, "Failed to create interview");
  }

  return interview;
};

export const updateInterviewService = async (
  userId: string,
  interviewId: string,
  data: UpdateInterviewInput,
) => {
  const [interview] = await db
    .select()
    .from(interviews)
    .where(and(eq(interviews.id, interviewId), eq(interviews.userId, userId)));

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  const {
    status,
    interviewType,
    scheduledAt,
    interviewerName,
    meetingLink,
    notes,
    feedback,
  } = data;

  const noChanges =
    (status === undefined || status === interview.status) &&
    (interviewType === undefined ||
      interviewType === interview.interviewType) &&
    (scheduledAt === undefined ||
      (scheduledAt === null
        ? interview.scheduledAt === null
        : interview.scheduledAt?.getTime() ===
          new Date(scheduledAt).getTime())) &&
    (interviewerName === undefined ||
      interviewerName === interview.interviewerName) &&
    (meetingLink === undefined || meetingLink === interview.meetingLink) &&
    (notes === undefined || notes === interview.notes) &&
    (feedback === undefined || feedback === interview.feedback);

  if (noChanges) {
    throw new ApiError(400, "No changes detected");
  }

  const updateData = {
    ...(status !== undefined && { status }),
    ...(interviewType !== undefined && { interviewType }),
    ...(scheduledAt !== undefined && {
      scheduledAt: scheduledAt === null ? null : new Date(scheduledAt),
    }),
    ...(interviewerName !== undefined && { interviewerName }),
    ...(meetingLink !== undefined && { meetingLink }),
    ...(notes !== undefined && { notes }),
    ...(feedback !== undefined && { feedback }),
    updatedAt: new Date(),
  };

  const [updatedInterview] = await db
    .update(interviews)
    .set(updateData)
    .where(and(eq(interviews.id, interviewId), eq(interviews.userId, userId)))
    .returning();

  if (!updatedInterview) {
    throw new ApiError(500, "Failed to update interview");
  }

  return updatedInterview;
};

export const getInterviewsService = async (userId: string) => {
  return await db
    .select()
    .from(interviews)
    .where(eq(interviews.userId, userId))
    .orderBy(
      sql`CASE WHEN ${interviews.scheduledAt} IS NULL THEN 1 ELSE 0 END`,
      asc(interviews.scheduledAt),
    );
};

export const getInterviewByIdService = async (
  userId: string,
  interviewId: string,
) => {
  const [interview] = await db
    .select()
    .from(interviews)
    .where(and(eq(interviews.userId, userId), eq(interviews.id, interviewId)));

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  return interview;
};

export const deleteInterviewService = async (
  userId: string,
  interviewId: string,
) => {
  const [interview] = await db
    .delete(interviews)
    .where(and(eq(interviews.userId, userId), eq(interviews.id, interviewId)))
    .returning();

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  return interview;
};
