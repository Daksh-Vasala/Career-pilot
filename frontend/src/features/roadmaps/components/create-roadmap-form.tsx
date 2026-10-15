"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, X, LoaderCircle, Route } from "lucide-react";
import Link from "next/link";
import { AxiosError } from "axios";

import { api } from "@/lib/api-client";
import {
  createRoadmapSchema,
  type CreateRoadmapFormValues,
} from "@/features/roadmaps/roadmap.validation";
import type { RoadmapDetailsResponse } from "@/features/roadmaps/roadmap.types";

export function CreateRoadmapForm() {
  const router = useRouter();
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoadmapFormValues>({
    resolver: zodResolver(createRoadmapSchema),
    defaultValues: {
      targetRole: "",
      currentSkills: [],
      durationWeeks: 8,
    },
  });

  function addSkill() {
    const skill = skillInput.trim();

    if (!skill) return;

    if (skills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
      setSkillInput("");
      return;
    }

    const updatedSkills = [...skills, skill];
    setSkills(updatedSkills);
    setValue("currentSkills", updatedSkills, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setSkillInput("");
    setSubmitError("");
  }

  function removeSkill(skillToRemove: string) {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    setValue("currentSkills", updatedSkills, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  async function onSubmit(values: CreateRoadmapFormValues) {
    setSubmitError("");

    try {
      const response = await api.post<RoadmapDetailsResponse>("/roadmaps", {
        ...values,
        currentSkills: skills,
      });

      router.push(`/roadmaps/${response.data.data.id}`);
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setSubmitError(
        axiosError.response?.data?.message ??
          "Unable to create your roadmap. Please try again.",
      );
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-7 p-4 sm:p-6 lg:p-8">
      <Link
        href="/roadmaps"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to roadmaps
      </Link>

      <header className="space-y-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Route size={23} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Create your roadmap
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Tell CareerPilot where you want to go and what you already know.
          We’ll build a structured learning plan around your goal.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="surface-raised space-y-7 p-5 sm:p-7">
        <div className="space-y-2">
          <label htmlFor="targetRole" className="text-sm font-medium text-foreground">
            Target role
          </label>
          <input
            id="targetRole"
            {...register("targetRole")}
            placeholder="e.g. Backend Developer"
            className="surface-inset min-h-11 w-full px-3 py-2 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.targetRole && (
            <p className="text-sm text-destructive">{errors.targetRole.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="skillInput" className="text-sm font-medium text-foreground">
              Current skills
            </label>
            <p className="mt-1 text-sm text-muted-foreground">
              Add technologies or concepts you already know.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              id="skillInput"
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSkill();
                }
              }}
              placeholder="e.g. JavaScript, React, SQL"
              className="surface-inset min-h-11 min-w-0 flex-1 px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={addSkill}
              disabled={!skillInput.trim() || skills.length >= 50}
              className="button-primary inline-flex min-h-11 items-center gap-2 px-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add skill</span>
            </button>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-accent px-3 py-1.5 text-sm text-accent-foreground"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    aria-label={`Remove ${skill}`}
                    className="rounded-full transition-opacity hover:opacity-60"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No skills added yet. You can still create a roadmap without them.
            </p>
          )}

          {errors.currentSkills && (
            <p className="text-sm text-destructive">
              {errors.currentSkills.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="durationWeeks" className="text-sm font-medium text-foreground">
            Learning duration
          </label>
          <p className="text-sm text-muted-foreground">
            How many weeks do you want your learning plan to cover?
          </p>
          <select
            id="durationWeeks"
            {...register("durationWeeks", { valueAsNumber: true })}
            className="surface-inset min-h-11 w-full px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {[4, 6, 8, 10, 12, 16, 20, 24, 36, 52].map((weeks) => (
              <option key={weeks} value={weeks}>
                {weeks} weeks
              </option>
            ))}
          </select>
          {errors.durationWeeks && (
            <p className="text-sm text-destructive">
              {errors.durationWeeks.message}
            </p>
          )}
        </div>

        {submitError && (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {submitError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Link
            href="/roadmaps"
            className="inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="button-primary inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <LoaderCircle size={16} className="animate-spin" />}
            {isSubmitting ? "Creating roadmap..." : "Create roadmap"}
          </button>
        </div>
      </form>
    </main>
  );
}