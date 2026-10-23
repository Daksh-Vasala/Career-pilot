"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import { toast } from "sonner";

import { getResumes } from "@/features/resumes/resume.service";
import {
  createResumeAnalysis,
  getResumeAnalyses,
} from "@/features/resumes/resume-analysis.service";
import type { Resume } from "@/features/resumes/resume.types";
import type {
  AtsReadiness,
  ResumeAnalysis,
} from "@/features/resumes/resume-analysise.types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function hasAtsReadinessResult(value: unknown): value is AtsReadiness {
  if (!value || typeof value !== "object") return false;

  const result = value as Partial<AtsReadiness>;
  return (
    typeof result.score === "number" &&
    Number.isFinite(result.score) &&
    typeof result.explanation === "string" &&
    Array.isArray(result.suggestions) &&
    result.suggestions.every((suggestion) => typeof suggestion === "string")
  );
}

export default function ResumeAnalysisPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadResumes() {
      try {
        const data = await getResumes();

        setResumes(data);

        if (data.length > 0) {
          setSelectedResumeId(data[0].id);
        }
      } catch {
        setError(true);
        toast.error("Failed to load resumes.");
      } finally {
        setLoadingResumes(false);
      }
    }

    void loadResumes();
  }, []);

  useEffect(() => {
    if (!selectedResumeId) {
      setAnalysis(null);
      return;
    }

    let cancelled = false;

    async function loadAnalysis() {
      setLoadingAnalysis(true);
      setAnalysis(null);

      try {
        const analyses = await getResumeAnalyses(selectedResumeId);

        if (!cancelled) {
          const latest = [...analyses].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )[0];

          setAnalysis(latest ?? null);
        }
      } catch {
        if (!cancelled) {
          toast.error("Failed to load previous analysis.");
        }
      } finally {
        if (!cancelled) {
          setLoadingAnalysis(false);
        }
      }
    }

    void loadAnalysis();

    return () => {
      cancelled = true;
    };
  }, [selectedResumeId]);

  async function handleGenerate() {
    if (!selectedResumeId) {
      toast.error("Select a resume first.");
      return;
    }

    setGenerating(true);

    try {
      const result = await createResumeAnalysis(
        selectedResumeId,
        jobDescription,
      );
      setAnalysis(result);
      toast.success("Resume analysis completed.");
    } catch {
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  const sections = analysis
    ? [
        {
          title: "Strengths",
          description: "What your resume already does well",
          icon: CheckCircle2,
          items: analysis.analysis.strengths,
        },
        {
          title: "Recommendations",
          description: "Changes worth making",
          icon: Lightbulb,
          items: analysis.analysis.recommendations,
        },
        {
          title: "Improvement areas",
          description: "Potential issues to review",
          icon: Target,
          items: analysis.analysis.improvementAreas,
        },
      ]
    : [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <header>
        <Link
          href="/resumes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to resumes
        </Link>

        <div className="mt-5 flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BrainCircuit size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              AI Resume Analysis
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Understand your resume's strengths and identify opportunities to
              improve it.
            </p>
          </div>
        </div>
      </header>

      <section className="surface-raised p-5 sm:p-6">
        <label htmlFor="job-description" className="mb-2 block text-sm font-medium">
          Job description <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="job-description"
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          maxLength={20000}
          rows={5}
          placeholder="Paste a job description for a separate job-specific match estimate."
          disabled={generating}
          className="surface-inset mb-5 w-full resize-y px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        />

        <label htmlFor="resume" className="mb-2 block text-sm font-medium">
          Select a resume
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            id="resume"
            value={selectedResumeId}
            onChange={(event) => setSelectedResumeId(event.target.value)}
            disabled={loadingResumes || resumes.length === 0 || generating}
            className="surface-inset min-w-0 flex-1 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <option value="">
              {loadingResumes ? "Loading resumes..." : "Choose a resume"}
            </option>

            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.title} — {resume.fileName}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={
              !selectedResumeId ||
              loadingResumes ||
              loadingAnalysis ||
              generating
            }
            className="button-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? (
              <RefreshCw size={17} className="animate-spin" />
            ) : (
              <Sparkles size={17} />
            )}
            {generating ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {!loadingResumes && resumes.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Upload a resume before starting an analysis.{" "}
            <Link
              href="/resumes/upload"
              className="font-medium text-primary underline underline-offset-4"
            >
              Upload resume
            </Link>
          </p>
        )}
      </section>

      {error && (
        <div className="surface-raised p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Couldn't load your resumes.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm font-medium text-primary"
          >
            Try again
          </button>
        </div>
      )}

      {loadingAnalysis && selectedResumeId && (
        <div className="animate-pulse space-y-4">
          <div className="h-32 rounded-2xl bg-muted/50" />
          <div className="h-48 rounded-2xl bg-muted/50" />
        </div>
      )}

      {!loadingAnalysis && analysis && (
        <>
          {hasAtsReadinessResult(analysis.analysis.atsReadiness) ? (
            <section className="surface-raised space-y-4 p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Target size={20} className="text-primary" />
                  <h2 className="text-lg font-semibold">ATS readiness estimate</h2>
                </div>
                <p className="text-2xl font-semibold text-primary">
                  {analysis.analysis.atsReadiness.score}/100
                </p>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {analysis.analysis.atsReadiness.explanation}
              </p>
              <div>
                <h3 className="font-medium">Suggestions to improve</h3>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {analysis.analysis.atsReadiness.suggestions.map((suggestion, index) => (
                    <li key={`ats-suggestion-${index}`}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
              <p className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
                This is an estimate, not a score from an actual employer ATS. It does not guarantee ATS passage
                or interview selection.
              </p>
            </section>
          ) : analysis.analysis.atsReadiness ? (
            <section className="surface-raised p-5 sm:p-7">
              <h2 className="font-semibold">ATS readiness estimate needs refreshing</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Run the analysis again to generate an estimate in the current format.
              </p>
            </section>
          ) : null}
          {analysis.analysis.atsReadiness === null && (
            <section className="surface-raised p-5 sm:p-7">
              <h2 className="font-semibold">ATS readiness estimate unavailable</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {analysis.analysis.atsReadinessError ??
                  "The ATS assessment could not be completed. Your resume analysis is still available."}
              </p>
            </section>
          )}

          <section className="surface-raised p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-primary" />
              <h2 className="text-lg font-semibold">Resume summary</h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {analysis.analysis.summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <span className="rounded-lg bg-muted px-3 py-2">
                Model: {analysis.model}
              </span>
              <span className="rounded-lg bg-muted px-3 py-2">
                Analyzed {formatDate(analysis.createdAt)}
              </span>
            </div>
          </section>

          <section className="surface-raised p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              <h2 className="text-lg font-semibold">Skills found</h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {analysis.analysis.skillsFound.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <section
                  key={section.title}
                  className="surface-raised p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon size={20} />
                    </div>

                    <h2 className="font-semibold">{section.title}</h2>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground">
                    {section.description}
                  </p>

                  <ul className="mt-4 space-y-3">
                    {section.items.map((item, index) => (
                      <li
                        key={`${section.title}-${index}`}
                        className="flex gap-2 text-sm leading-6 text-muted-foreground"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </>
      )}

      {!loadingResumes && !loadingAnalysis && selectedResumeId && !analysis && (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <BrainCircuit size={32} className="mx-auto text-muted-foreground" />

          <h2 className="mt-4 font-semibold">Ready to analyze</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate an analysis to see your resume summary, strengths, skills,
            and improvement suggestions.
          </p>
        </div>
      )}
    </div>
  );
}
