"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Clock3,
  Map,
  Plus,
  Route,
  Target,
} from "lucide-react";

import type { Roadmap } from "@/features/roadmaps/roadmap.types";

interface RoadmapsClientProps {
  initialRoadmaps: Roadmap[];
}

export function RoadmapsClient({ initialRoadmaps }: RoadmapsClientProps) {
  const [roadmaps] = useState(initialRoadmaps);

  const activeCount = roadmaps.filter(
    (roadmap) => roadmap.status === "ACTIVE",
  ).length;

  const completedCount = roadmaps.filter(
    (roadmap) => roadmap.status === "COMPLETED",
  ).length;

  const archivedCount = roadmaps.filter(
    (roadmap) => roadmap.status === "ARCHIVED",
  ).length;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <BrainCircuit size={17} />
            AI-powered career planning
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Your Roadmaps
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Turn your career goals into a structured learning plan with
            milestones and actionable tasks.
          </p>
        </div>

        <Link
          href="/roadmaps/new"
          className="button-primary inline-flex min-h-11 shrink-0 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium"
        >
          <Plus size={17} />
          Create roadmap
        </Link>
      </section>

      {/* Summary cards */}
      <section
        aria-label="Roadmap summary"
        className="grid grid-cols-1 gap-5 sm:grid-cols-3"
      >
        <SummaryCard
          icon={<Map size={19} />}
          label="Total roadmaps"
          value={roadmaps.length}
        />

        <SummaryCard
          icon={<Route size={19} />}
          label="Active roadmaps"
          value={activeCount}
        />

        <SummaryCard
          icon={<Target size={19} />}
          label="Completed roadmaps"
          value={completedCount}
        />
      </section>

      {/* Roadmap list */}
      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Your learning plans
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Track your progress toward your next career goal.
            </p>
          </div>

          {archivedCount > 0 && (
            <span className="surface-inset inline-flex w-fit items-center px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {archivedCount} archived
            </span>
          )}
        </div>

        {roadmaps.length === 0 ? (
          <div className="surface-inset px-6 py-14 text-center">
            <div className="surface-raised mx-auto flex size-16 items-center justify-center rounded-2xl text-primary">
              <BrainCircuit size={27} strokeWidth={1.7} />
            </div>

            <h3 className="mt-6 text-lg font-semibold text-foreground">
              Your next chapter starts here
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Choose a target role and your current skills. CareerPilot will
              turn them into an AI-generated roadmap with milestones and tasks.
            </p>

            <Link
              href="/roadmaps/new"
              className="button-primary mt-6 inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium"
            >
              <Plus size={17} />
              Create your first roadmap
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {roadmaps.map((roadmap) => (
              <Link
                key={roadmap.id}
                href={`/roadmaps/${roadmap.id}`}
                className="surface-raised surface-raised-hover group block p-5 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="surface-inset flex size-11 shrink-0 items-center justify-center text-primary">
                    <Target size={21} strokeWidth={1.8} />
                  </div>

                  <StatusBadge status={roadmap.status} />
                </div>

                <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                  {roadmap.targetRole}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  Build the skills and experience needed to pursue your goal as
                  a {roadmap.targetRole}.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={15} />
                    {roadmap.durationWeeks} weeks
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <BrainCircuit size={15} />
                    {roadmap.currentSkills.length} current skills
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4 text-sm">
                  <span className="text-muted-foreground">
                    Created {new Date(roadmap.createdAt).toLocaleDateString()}
                  </span>

                  <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                    View roadmap
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="surface-raised surface-raised-hover p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>

        <span className="surface-inset flex size-10 shrink-0 items-center justify-center text-primary">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: Roadmap["status"] }) {
  const styles: Record<Roadmap["status"], string> = {
    ACTIVE: "bg-accent text-accent-foreground",
    COMPLETED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    ARCHIVED: "bg-muted text-muted-foreground",
  };

  const labels: Record<Roadmap["status"], string> = {
    ACTIVE: "Active",
    COMPLETED: "Completed",
    ARCHIVED: "Archived",
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
