"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Save, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import type {
  Application,
  ApplicationStatus,
} from "@/features/applications/application.types";
import type { Job } from "@/features/jobs/job.types";
import {
  updateApplication,
  deleteApplication,
} from "@/features/applications/application.service";

interface ApplicationDetailsClientProps {
  initialApplication: Application;
  job: Job;
}

const statusOptions: { label: string; value: ApplicationStatus }[] = [
  { label: "Applied", value: "APPLIED" },
  { label: "Interview", value: "INTERVIEW" },
  { label: "Offer", value: "OFFER" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
];

function toDateInputValue(date: string | null) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return [
    parsed.getFullYear(),
    String(parsed.getMonth() + 1).padStart(2, "0"),
    String(parsed.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatDate(date: string | null) {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not specified";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ApplicationDetailsClient({
  initialApplication,
  job,
}: ApplicationDetailsClientProps) {
  const router = useRouter();

  const [status, setStatus] = useState<ApplicationStatus>(
    initialApplication.status,
  );
  const [appliedAt, setAppliedAt] = useState(
    toDateInputValue(initialApplication.appliedAt),
  );
  const [recruiterName, setRecruiterName] = useState(
    initialApplication.recruiterName ?? "",
  );
  const [recruiterEmail, setRecruiterEmail] = useState(
    initialApplication.recruiterEmail ?? "",
  );
  const [notes, setNotes] = useState(initialApplication.notes ?? "");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      recruiterEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recruiterEmail.trim())
    ) {
      toast.error("Enter a valid recruiter email.");
      return;
    }

    setSaving(true);

    try {
      await updateApplication(initialApplication.id, {
        status,
        appliedAt: appliedAt
          ? new Date(`${appliedAt}T12:00:00.000Z`).toISOString()
          : null,
        recruiterName: recruiterName.trim() || null,
        recruiterEmail: recruiterEmail.trim() || null,
        notes: notes.trim() || null,
      });

      toast.success("Application updated successfully.");
      router.refresh();
    } catch (error) {
      console.error("Failed to update application:", error);
      toast.error("Could not update application. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);

    try {
      await deleteApplication(initialApplication.id);
      toast.success("Application deleted.");
      setDeleteConfirmOpen(false);
      router.push("/applications");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete application:", error);
      toast.error("Could not delete application. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/applications"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>

      <header className="surface-raised p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm text-muted-foreground">{job.companyName}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              {job.jobTitle}
            </h1>

            <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {job.location && <span>{job.location}</span>}
              {job.employmentType && <span>· {job.employmentType}</span>}
              {job.salary && <span>· {job.salary}</span>}
            </div>
          </div>

          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="surface-raised inline-flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              View job posting
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {job.description && (
          <div className="mt-6 border-t border-border pt-5">
            <h2 className="font-semibold">Job description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {job.description}
            </p>
          </div>
        )}
      </header>

      <form
        onSubmit={handleSave}
        className="surface-raised space-y-6 p-6"
      >
        <div>
          <h2 className="text-lg font-semibold">Application details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your application status and recruiter information up to date.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="application-status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="application-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ApplicationStatus)
              }
              className="surface-inset h-10 w-full px-3 text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="applied-at" className="text-sm font-medium">
              Applied date
            </label>
            <input
              id="applied-at"
              type="date"
              value={appliedAt}
              onChange={(event) => setAppliedAt(event.target.value)}
              className="surface-inset h-10 w-full px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="recruiter-name" className="text-sm font-medium">
              Recruiter name
            </label>
            <input
              id="recruiter-name"
              value={recruiterName}
              onChange={(event) => setRecruiterName(event.target.value)}
              maxLength={150}
              placeholder="e.g. Priya Shah"
              className="surface-inset h-10 w-full px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="recruiter-email" className="text-sm font-medium">
              Recruiter email
            </label>
            <input
              id="recruiter-email"
              type="email"
              value={recruiterEmail}
              onChange={(event) => setRecruiterEmail(event.target.value)}
              placeholder="recruiter@company.com"
              className="surface-inset h-10 w-full px-3 text-sm"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="application-notes" className="text-sm font-medium">
              Notes
            </label>
            <textarea
              id="application-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={5}
              placeholder="Interview dates, follow-up reminders, or other notes..."
              className="surface-inset w-full px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(true)}
            disabled={deleting || saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-destructive/30 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete application
          </button>

          <button
            type="submit"
            disabled={saving || deleting}
            className="button-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      <p className="text-xs text-muted-foreground">
        Created {formatDate(initialApplication.createdAt)} · Last updated{" "}
        {formatDate(initialApplication.updatedAt)}
      </p>
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete application?"
        description={`Delete your application for ${job.jobTitle} at ${job.companyName}?`}
        confirmLabel="Delete application"
        onConfirm={() => void handleDelete()}
        isPending={deleting}
      />
    </div>
  );
}
