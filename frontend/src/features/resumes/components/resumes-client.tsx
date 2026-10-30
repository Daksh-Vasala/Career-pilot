"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  ExternalLink,
  Trash2,
  RefreshCw,
  File,
  BrainCircuit,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { getResumes, deleteResume } from "@/features/resumes/resume.service";
import type { Resume } from "@/features/resumes/resume.types";

interface ResumesClientProps {
  initialResumes: Resume[];
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ResumesClient({ initialResumes }: ResumesClientProps) {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await getResumes();
      setResumes(data);
    } catch {
      setError(true);
      toast.error("Failed to load resumes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("refresh")) return;

    async function refreshAfterUpload() {
      try {
        const data = await getResumes();
        setResumes(data);
      } catch {
        setError(true);
        toast.error("Failed to load resumes.");
      } finally {
        router.replace("/resumes", { scroll: false });
      }
    }

    void refreshAfterUpload();
  }, [router]);

  async function handleDelete() {
    if (!resumeToDelete) return;
    const resume = resumeToDelete;
    setDeletingId(resume.id);

    try {
      await deleteResume(resume.id);

      setResumes((current) => current.filter((item) => item.id !== resume.id));

      toast.success("Resume deleted successfully.");
      setResumeToDelete(null);
    } catch {
      toast.error("Failed to delete resume.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            My Resumes
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your resumes and prepare for your next opportunity.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/resumes/upload"
            className="button-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium"
          >
            <Upload size={18} />
            Upload Resume
          </Link>

          <Link
            href="/resumes/analysis"
            className="surface-raised inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <BrainCircuit size={18} />
            AI Analysis
          </Link>
        </div>
      </header>

      <section className="surface-raised p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText size={24} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Total Resumes</p>
            <p className="text-2xl font-semibold">
              {loading ? "—" : resumes.length}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your files</h2>

          {!loading && !error && (
            <span className="text-sm text-muted-foreground">
              {resumes.length} {resumes.length === 1 ? "file" : "files"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl border border-border bg-muted/40"
              />
            ))}
          </div>
        ) : error ? (
          <div className="surface-raised p-8 text-center">
            <p className="text-muted-foreground">
              We couldn&apos;t load your resumes.
            </p>

            <button
              onClick={() => void fetchResumes()}
              className="button-primary mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : resumes.length === 0 ? (
          <div className="surface-raised px-6 py-14 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText size={28} />
            </div>

            <h3 className="mt-4 text-lg font-semibold">No resumes yet</h3>

            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Upload your first resume to keep your career documents organized
              in one place.
            </p>

            <Link
              href="/resumes/upload"
              className="button-primary mt-5 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
            >
              <Upload size={17} />
              Upload your first resume
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resumes.map((resume) => (
              <article
                key={resume.id}
                className="surface-raised surface-raised-hover flex min-w-0 flex-col p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <File size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold" title={resume.title}>
                      {resume.title}
                    </h3>

                    <p
                      className="mt-1 truncate text-sm text-muted-foreground"
                      title={resume.fileName}
                    >
                      {resume.fileName}
                    </p>
                  </div>

                  <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                    PDF
                  </span>
                </div>

                <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between gap-3">
                    <span>File size</span>
                    <span className="text-foreground">
                      {formatFileSize(resume.fileSize)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span>Uploaded</span>
                    <span className="text-foreground">
                      {formatDate(resume.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="surface-raised inline-flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <ExternalLink size={16} />
                    Open PDF
                  </a>

                  <button
                    onClick={() => setResumeToDelete(resume)}
                    disabled={deletingId === resume.id}
                    aria-label={`Delete ${resume.fileName}`}
                    title="Delete resume"
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === resume.id ? (
                      <RefreshCw size={17} className="animate-spin" />
                    ) : (
                      <Trash2 size={17} />
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <ConfirmationDialog
        open={resumeToDelete !== null}
        onOpenChange={(open) => {
          if (!open && deletingId === null) setResumeToDelete(null);
        }}
        title="Delete resume?"
        description={
          resumeToDelete
            ? `Are you sure you want to delete "${resumeToDelete.fileName}"?`
            : ""
        }
        confirmLabel="Delete resume"
        onConfirm={() => void handleDelete()}
        isPending={deletingId !== null}
      />
    </div>
  );
}
