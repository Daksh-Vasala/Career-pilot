import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { roadmaps, roadmapMilestones } from "../../db/schema/roadmap.ts";
import type {
  CreateRoadmapInput,
  UpdateRoadmapInput,
} from "./roadmap.validation.ts";
import { ApiError } from "../../utils/api-error.ts";
import { generateRoadmapWithGemini } from "../ai/providers/gemini.provider.ts";

export async function createRoadmapService(
  userId: string,
  data: CreateRoadmapInput,
) {
  const [roadmap] = await db
    .insert(roadmaps)
    .values({
      userId,
      targetRole: data.targetRole,
      currentSkills: data.currentSkills,
      durationWeeks: data.durationWeeks,
    })
    .returning();

  if (!roadmap) {
    throw new ApiError(500, "Failed to create roadmap");
  }

  return roadmap;
}

export async function getRoadmapsService(userId: string) {
  return db
    .select()
    .from(roadmaps)
    .where(eq(roadmaps.userId, userId))
    .orderBy(desc(roadmaps.createdAt));
}

export async function getRoadmapByIdService(userId: string, roadmapId: string) {
  const [roadmap] = await db
    .select()
    .from(roadmaps)
    .where(and(eq(roadmaps.id, roadmapId), eq(roadmaps.userId, userId)))
    .limit(1);

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  const milestones = await db
    .select()
    .from(roadmapMilestones)
    .where(eq(roadmapMilestones.roadmapId, roadmapId))
    .orderBy(roadmapMilestones.order);

  return { ...roadmap, milestones };
}

export async function updateRoadmapService(
  userId: string,
  roadmapId: string,
  data: UpdateRoadmapInput,
) {
  const [roadmap] = await db
    .update(roadmaps)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(roadmaps.id, roadmapId), eq(roadmaps.userId, userId)))
    .returning();

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  return roadmap;
}

export async function updateMilestoneProgressService(
  userId: string,
  roadmapId: string,
  milestoneId: string,
  isCompleted: boolean,
) {
  const [ownedRoadmap] = await db
    .select({ id: roadmaps.id })
    .from(roadmaps)
    .where(and(eq(roadmaps.id, roadmapId), eq(roadmaps.userId, userId)))
    .limit(1);

  if (!ownedRoadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  const [milestone] = await db
    .update(roadmapMilestones)
    .set({
      isCompleted,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(roadmapMilestones.id, milestoneId),
        eq(roadmapMilestones.roadmapId, roadmapId),
      ),
    )
    .returning();

  if (!milestone) {
    throw new ApiError(404, "Milestone not found");
  }

  return milestone;
}

export async function saveGeneratedMilestonesService(
  userId: string,
  roadmapId: string,
  milestones: {
    title: string;
    description: string;
    order: number;
    tasks: {
      title: string;
      description: string;
    }[];
  }[],
) {
  const [roadmap] = await db
    .select({ id: roadmaps.id })
    .from(roadmaps)
    .where(and(eq(roadmaps.id, roadmapId), eq(roadmaps.userId, userId)))
    .limit(1);

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  if (milestones.length === 0) {
    throw new ApiError(400, "At least one milestone is required");
  }

  return db
    .insert(roadmapMilestones)
    .values(
      milestones.map((milestone) => ({
        roadmapId,
        title: milestone.title,
        description: milestone.description,
        order: milestone.order,
        tasks: milestone.tasks,
      })),
    )
    .returning();
}

export async function generateRoadmapService(
  userId: string,
  roadmapId: string,
) {
  const [roadmap] = await db
    .select()
    .from(roadmaps)
    .where(and(eq(roadmaps.id, roadmapId), eq(roadmaps.userId, userId)))
    .limit(1);

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  const generatedMilestones = await generateRoadmapWithGemini({
    targetRole: roadmap.targetRole,
    currentSkills: roadmap.currentSkills,
    durationWeeks: roadmap.durationWeeks,
  });

  if (generatedMilestones.length === 0) {
    throw new ApiError(502, "AI generated no roadmap milestones");
  }

  // Replace existing milestones so regeneration doesn't create duplicates.
  return db.transaction(async (tx) => {
    await tx
      .delete(roadmapMilestones)
      .where(eq(roadmapMilestones.roadmapId, roadmapId));

    return tx
      .insert(roadmapMilestones)
      .values(
        generatedMilestones.map((milestone) => ({
          roadmapId,
          title: milestone.title,
          description: milestone.description,
          order: milestone.order,
          tasks: milestone.tasks,
        })),
      )
      .returning();
  });
}

export async function deleteRoadmapService(
  roadmapId: string,
  userId: string,
) {
  const [deletedRoadmap] = await db
    .delete(roadmaps)
    .where(
      and(
        eq(roadmaps.id, roadmapId),
        eq(roadmaps.userId, userId),
      ),
    )
    .returning({ id: roadmaps.id });

  if (!deletedRoadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  return deletedRoadmap;
}