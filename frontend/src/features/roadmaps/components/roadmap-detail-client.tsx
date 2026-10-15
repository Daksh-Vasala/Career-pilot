"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  LoaderCircle,
  RefreshCw,
  Route,
  Target,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { AxiosError } from "axios";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import type {
  RoadmapDetails,
  RoadmapMilestone,
} from "@/features/roadmaps/roadmap.types";
import {
  deleteRoadmap,
  generateRoadmap,
  updateMilestoneCompletion,
} from "@/features/roadmaps/roadmap.api";

interface RoadmapDetailClientProps {
  initialRoadmap: RoadmapDetails;
}

export function RoadmapDetailClient({
  initialRoadmap,
}: RoadmapDetailClientProps) {
  const router = useRouter();

  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingMilestoneId, setUpdatingMilestoneId] = useState<string | null>(
    null,
  );
  const [expandedMilestones, setExpandedMilestones] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegenerationConfirmationOpen, setIsRegenerationConfirmationOpen] =
    useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  const completedCount = roadmap.milestones.filter(
    (milestone) => milestone.isCompleted,
  ).length;

  const totalCount = roadmap.milestones.length;

  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  function getErrorMessage(error: unknown, fallback: string) {
    const axiosError = error as AxiosError<{ message?: string }>;

    return axiosError.response?.data?.message ?? fallback;
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setErrorMessage("");

    try {
      const milestones = await generateRoadmap(roadmap.id);
      setRoadmap((current) => ({ ...current, milestones }));
      setExpandedMilestones([]);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to generate milestones. Please try again.",
        ),
      );
    } finally {
      setIsGenerating(false);
      setIsRegenerationConfirmationOpen(false);
    }
  }

  function handleGenerateClick() {
    if (isGenerating || isDeleting) return;

    if (roadmap.milestones.length > 0) {
      setIsRegenerationConfirmationOpen(true);
      return;
    }

    void handleGenerate();
  }

  async function handleDelete() {
    if (isDeleting || isGenerating) return;

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await deleteRoadmap(roadmap.id);
      router.replace("/roadmaps");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to delete this roadmap. Please try again.",
        ),
      );
      setIsDeleting(false);
      setIsDeleteConfirmationOpen(false);
    }
  }

  async function handleMilestoneToggle(milestone: RoadmapMilestone) {
    if (isGenerating || isDeleting || updatingMilestoneId !== null) return;

    const nextCompleted = !milestone.isCompleted;

    setUpdatingMilestoneId(milestone.id);
    setErrorMessage("");

    try {
      const updatedMilestone = await updateMilestoneCompletion(
        roadmap.id,
        milestone.id,
        nextCompleted,
      );

      setRoadmap((current) => {
        const milestones = current.milestones.map((item) =>
          item.id === updatedMilestone.id ? updatedMilestone : item,
        );

        const allCompleted =
          milestones.length > 0 &&
          milestones.every((item) => item.isCompleted);

        return {
          ...current,
          milestones,
          status: allCompleted ? "COMPLETED" : "ACTIVE",
        };
      });
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Unable to update milestone progress."),
      );
    } finally {
      setUpdatingMilestoneId(null);
    }
  }

  function toggleExpanded(milestoneId: string) {
    setExpandedMilestones((current) =>
      current.includes(milestoneId)
        ? current.filter((id) => id !== milestoneId)
        : [...current, milestoneId],
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-7 p-4 sm:p-6 lg:p-8">
      <Link
        href="/roadmaps"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        All roadmaps
      </Link>

      <section className="space-y-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <BrainCircuit size={17} />
              AI learning roadmap
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {roadmap.targetRole}
            </h1>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={15} />
                {roadmap.durationWeeks} weeks
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Target size={15} />
                {roadmap.currentSkills.length} current skills
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteConfirmationOpen(true)}
              disabled={isDeleting || isGenerating}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-destructive/30 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              {isDeleting ? "Deleting..." : "Delete roadmap"}
            </button>

            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={isGenerating || isDeleting}
              className="button-primary inline-flex min-h-11 shrink-0 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : roadmap.milestones.length > 0 ? (
                <RefreshCw size={16} />
              ) : (
                <BrainCircuit size={17} />
              )}
              {isGenerating
                ? "Generating..."
                : roadmap.milestones.length > 0
                  ? "Regenerate with AI"
                  : "Generate with AI"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {errorMessage}
          </p>
        )}
      </section>

      <section className="surface-raised space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Overall progress
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {progress}%
            </p>
          </div>

          <div className="surface-inset flex size-12 items-center justify-center text-primary">
            <Route size={22} />
          </div>
        </div>

        <div
          className="surface-inset h-3 w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-label="Roadmap completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {completedCount} of {totalCount} milestones completed
        </p>
      </section>

      {roadmap.milestones.length === 0 ? (
        <section className="surface-inset px-6 py-14 text-center">
          <div className="surface-raised mx-auto flex size-16 items-center justify-center rounded-2xl text-primary">
            <BrainCircuit size={28} />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-foreground">
            Your learning plan is ready to generate
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Generate a personalized sequence of milestones and actionable
            tasks for your target role.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Learning milestones
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Work through each milestone and mark it complete when you&apos;re
              finished.
            </p>
          </div>

          <div className="space-y-4">
            {roadmap.milestones
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((milestone) => {
                const isExpanded = expandedMilestones.includes(milestone.id);
                const isUpdating = updatingMilestoneId === milestone.id;

                return (
                  <article
                    key={milestone.id}
                    className="surface-raised overflow-hidden"
                  >
                    <div className="flex items-start gap-4 p-4 sm:p-5">
                      <button
                        type="button"
                        onClick={() => void handleMilestoneToggle(milestone)}
                        disabled={
                          isUpdating ||
                          updatingMilestoneId !== null ||
                          isGenerating ||
                          isDeleting
                        }
                        aria-label={
                          milestone.isCompleted
                            ? `Mark ${milestone.title} incomplete`
                            : `Mark ${milestone.title} complete`
                        }
                        className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-60 ${
                          milestone.isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-transparent hover:border-primary"
                        }`}
                      >
                        {isUpdating ? (
                          <LoaderCircle
                            size={15}
                            className="animate-spin text-primary"
                          />
                        ) : (
                          <Check size={16} />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Milestone {milestone.order}
                          </span>

                          {milestone.isCompleted && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                              <CheckCircle2 size={13} />
                              Completed
                            </span>
                          )}
                        </div>

                        <h3
                          className={`mt-1 text-base font-semibold ${
                            milestone.isCompleted
                              ? "text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {milestone.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {milestone.description}
                        </p>

                        <button
                          type="button"
                          onClick={() => toggleExpanded(milestone.id)}
                          aria-expanded={isExpanded}
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80"
                        >
                          {milestone.tasks.length} tasks
                          {isExpanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>

                        {isExpanded && (
                          <ul className="mt-4 space-y-3 border-t border-border/70 pt-4">
                            {milestone.tasks.map((task, index) => (
                              <li
                                key={`${milestone.id}-${index}`}
                                className="surface-inset p-3"
                              >
                                <p className="text-sm font-medium text-foreground">
                                  {task.title}
                                </p>
                                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                  {task.description}
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </section>
      )}

      <ConfirmationDialog
        open={isRegenerationConfirmationOpen}
        onOpenChange={(open) => {
          if (!open && !isGenerating) {
            setIsRegenerationConfirmationOpen(false);
          }
        }}
        title="Regenerate roadmap?"
        description="Regenerating this roadmap will replace its current milestones and reset completion progress. Continue?"
        confirmLabel="Regenerate roadmap"
        onConfirm={() => void handleGenerate()}
        isPending={isGenerating}
      />

      <ConfirmationDialog
        open={isDeleteConfirmationOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setIsDeleteConfirmationOpen(open);
          }
        }}
        title="Delete roadmap?"
        description={`This will permanently delete the roadmap for "${roadmap.targetRole}" and its milestones. This action cannot be undone.`}
        confirmLabel="Delete roadmap"
        onConfirm={() => void handleDelete()}
        isPending={isDeleting}
      />
    </main>
  );
}