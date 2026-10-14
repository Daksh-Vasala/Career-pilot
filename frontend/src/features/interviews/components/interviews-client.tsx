"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Video,
  RefreshCw,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import {
  createInterview,
  updateInterview,
  deleteInterview,
} from "@/features/interviews/interview.service";
import type {
  Interview,
  InterviewStatus,
  InterviewType,
} from "@/features/interviews/interview.types";
import type { Application } from "@/features/applications/application.types";
import type { Job } from "@/features/jobs/job.types";

interface InterviewsClientProps {
  initialInterviews: Interview[];
  initialApplications: Application[];
  initialJobs: Job[];
}

interface InterviewFormData {
  applicationId: string;
  interviewType: InterviewType | "";
  scheduledAt: string;
  status: InterviewStatus;
  interviewerName: string;
  meetingLink: string;
  notes: string;
  feedback: string;
}

const emptyForm: InterviewFormData = {
  applicationId: "",
  interviewType: "TECHNICAL",
  scheduledAt: "",
  status: "SCHEDULED",
  interviewerName: "",
  meetingLink: "",
  notes: "",
  feedback: "",
};

const statusLabels: Record<InterviewStatus, string> = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const typeLabels: Record<InterviewType, string> = {
  TECHNICAL: "Technical",
  HR: "HR",
  BEHAVIORAL: "Behavioral",
  MANAGERIAL: "Managerial",
  GROUP_DISCUSSION: "Group discussion",
  OTHER: "Other",
};

function formatDate(date: string | null) {
  if (!date) return "Not scheduled";

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function toLocalDateTime(date: string | null) {
  if (!date) return "";

  const value = new Date(date);
  const offset = value.getTimezoneOffset() * 60_000;

  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

export function InterviewsClient({
  initialInterviews,
  initialApplications,
  initialJobs,
}: InterviewsClientProps) {
  const router = useRouter();

  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [applications] = useState<Application[]>(initialApplications);
  const [jobs] = useState<Job[]>(initialJobs);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InterviewStatus | "ALL">(
    "ALL",
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(
    null,
  );
  const [form, setForm] = useState<InterviewFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Interview | null>(null);

  const jobsById = useMemo(
    () => new Map(jobs.map((job) => [job.id, job])),
    [jobs],
  );

  const applicationsById = useMemo(
    () =>
      new Map(applications.map((application) => [application.id, application])),
    [applications],
  );

  const interviewApplications = applications.filter(
    (application) => application.status === "INTERVIEW",
  );

  const getRelatedDetails = (interview: Interview) => {
    const application = applicationsById.get(interview.applicationId);
    const job = application ? jobsById.get(application.jobId) : undefined;

    return { application, job };
  };

  const filteredInterviews = interviews.filter((interview) => {
    const { job } = getRelatedDetails(interview);
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      (job?.companyName ?? "").toLowerCase().includes(query) ||
      (job?.jobTitle ?? "").toLowerCase().includes(query) ||
      (interview.interviewerName ?? "").toLowerCase().includes(query) ||
      (interview.interviewType
        ? typeLabels[interview.interviewType].toLowerCase().includes(query)
        : false);

    const matchesStatus =
      statusFilter === "ALL" || interview.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function openCreateDialog() {
    if (interviewApplications.length === 0) {
      toast.info(
        "Move an application to Interview status before scheduling a round.",
      );
      return;
    }

    setEditingInterview(null);
    setForm({
      ...emptyForm,
      applicationId: interviewApplications[0].id,
    });
    setDialogOpen(true);
  }

  function openEditDialog(interview: Interview) {
    setEditingInterview(interview);
    setForm({
      applicationId: interview.applicationId,
      interviewType: interview.interviewType ?? "",
      scheduledAt: toLocalDateTime(interview.scheduledAt),
      status: interview.status,
      interviewerName: interview.interviewerName ?? "",
      meetingLink: interview.meetingLink ?? "",
      notes: interview.notes ?? "",
      feedback: interview.feedback ?? "",
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    if (saving) return;
    setDialogOpen(false);
    setEditingInterview(null);
    setForm(emptyForm);
  }

  function updateField<K extends keyof InterviewFormData>(
    field: K,
    value: InterviewFormData[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const scheduledAt = form.scheduledAt
        ? new Date(form.scheduledAt).toISOString()
        : null;

      if (editingInterview) {
        const updated = await updateInterview(editingInterview.id, {
          status: form.status,
          interviewType: form.interviewType || null,
          scheduledAt,
          interviewerName: form.interviewerName.trim() || null,
          meetingLink: form.meetingLink.trim() || null,
          notes: form.notes.trim() || null,
          feedback: form.feedback.trim() || null,
        });

        setInterviews((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
        toast.success("Interview updated successfully.");
      } else {
        const created = await createInterview({
          applicationId: form.applicationId,
          status: form.status,
          ...(form.interviewType && { interviewType: form.interviewType }),
          ...(scheduledAt && { scheduledAt }),
          ...(form.interviewerName.trim() && {
            interviewerName: form.interviewerName.trim(),
          }),
          ...(form.meetingLink.trim() && {
            meetingLink: form.meetingLink.trim(),
          }),
          ...(form.notes.trim() && { notes: form.notes.trim() }),
          ...(form.feedback.trim() && { feedback: form.feedback.trim() }),
        });

        setInterviews((current) => [...current, created]);
        toast.success("Interview scheduled successfully.");
      }

      setDialogOpen(false);
      setEditingInterview(null);
      setForm(emptyForm);
      router.refresh();
    } catch {
      toast.error(
        editingInterview
          ? "Failed to update interview."
          : "Failed to schedule interview.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete(interview: Interview) {
    setDeletingId(interview.id);

    try {
      await deleteInterview(interview.id);
      setInterviews((current) =>
        current.filter((item) => item.id !== interview.id),
      );
      setConfirmation(null);
      toast.success("Interview deleted successfully.");
      router.refresh();
    } catch {
      toast.error("Failed to delete interview.");
    } finally {
      setDeletingId(null);
    }
  }

  const scheduledCount = interviews.filter(
    (item) => item.status === "SCHEDULED",
  ).length;
  const completedCount = interviews.filter(
    (item) => item.status === "COMPLETED",
  ).length;
  const cancelledCount = interviews.filter(
    (item) => item.status === "CANCELLED",
  ).length;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Interviews
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Schedule rounds and keep track of your interview progress.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateDialog}
          className="button-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium"
        >
          <Plus size={18} />
          Schedule interview
        </button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total rounds"
          value={interviews.length}
          icon={<CalendarDays size={21} />}
        />
        <SummaryCard
          label="Scheduled"
          value={scheduledCount}
          icon={<Clock size={21} />}
        />
        <SummaryCard
          label="Completed"
          value={completedCount}
          icon={<CheckCircle2 size={21} />}
        />
        <SummaryCard
          label="Cancelled"
          value={cancelledCount}
          icon={<X size={21} />}
        />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Your interview rounds</h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search interviews..."
                aria-label="Search interviews"
                className="surface-inset w-full py-2.5 pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as InterviewStatus | "ALL")
              }
              aria-label="Filter by interview status"
              className="surface-inset px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="ALL">All statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredInterviews.length === 0 ? (
          <div className="surface-raised px-6 py-14 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CalendarDays size={28} />
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              {interviews.length === 0
                ? "No interviews scheduled"
                : "No matching interviews"}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {interviews.length === 0
                ? "Create an interview round for an application that is in the interview stage."
                : "Try a different search term or status filter."}
            </p>
            {interviews.length === 0 && (
              <button
                type="button"
                onClick={openCreateDialog}
                className="button-primary mt-5 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
              >
                <Plus size={17} />
                Schedule your first interview
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredInterviews.map((interview) => {
              const { job } = getRelatedDetails(interview);

              return (
                <article
                  key={interview.id}
                  className="surface-raised surface-raised-hover flex min-w-0 flex-col p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building2 size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold">
                        {job?.jobTitle ?? "Unknown job"}
                      </h3>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {job?.companyName ?? "Company unavailable"}
                      </p>
                    </div>

                    <span className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-medium">
                      {statusLabels[interview.status]}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-muted px-2.5 py-1.5 text-xs">
                      {interview.interviewType
                        ? typeLabels[interview.interviewType]
                        : "Type not specified"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-xs">
                      <CalendarDays size={13} />
                      {formatDate(interview.scheduledAt)}
                    </span>
                  </div>

                  {interview.interviewerName && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Interviewer:{" "}
                      <span className="font-medium text-foreground">
                        {interview.interviewerName}
                      </span>
                    </p>
                  )}

                  {interview.meetingLink && (
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex w-fit items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <Video size={16} />
                      Join meeting
                    </a>
                  )}

                  {interview.notes && (
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {interview.notes}
                    </p>
                  )}

                  {interview.feedback && interview.status === "COMPLETED" && (
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      Feedback: {interview.feedback}
                    </p>
                  )}

                  <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
                    <button
                      type="button"
                      onClick={() => openEditDialog(interview)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmation(interview)}
                      disabled={deletingId === interview.id}
                      aria-label="Delete interview"
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                    >
                      {deletingId === interview.id ? (
                        <RefreshCw size={17} className="animate-spin" />
                      ) : (
                        <Trash2 size={17} />
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmationDialog
        open={confirmation !== null}
        onOpenChange={(open) => {
          if (!open && deletingId === null) setConfirmation(null);
        }}
        title="Delete interview?"
        description={
          confirmation
            ? `Are you sure you want to delete this ${confirmation.interviewType ? typeLabels[confirmation.interviewType] : ""} interview round? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete interview"
        variant="destructive"
        onConfirm={() => {
          if (confirmation) void confirmDelete(confirmation);
        }}
        isPending={deletingId !== null}
      />

      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="interview-dialog-title"
            className="surface-modal my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto p-5 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="interview-dialog-title"
                  className="text-xl font-semibold"
                >
                  {editingInterview ? "Edit Interview" : "Schedule Interview"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {editingInterview
                    ? "Update the details of this interview round."
                    : "Add a round for an application in the interview stage."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDialog}
                disabled={saving}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="applicationId" className="text-sm font-medium">
                  Application *
                </label>
                <select
                  id="applicationId"
                  required
                  disabled={Boolean(editingInterview)}
                  value={form.applicationId}
                  onChange={(event) =>
                    updateField("applicationId", event.target.value)
                  }
                  className="surface-inset w-full px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                >
                  <option value="">Select application</option>
                  {interviewApplications.map((application) => {
                    const job = jobsById.get(application.jobId);
                    return (
                      <option key={application.id} value={application.id}>
                        {job
                          ? `${job.companyName} — ${job.jobTitle}`
                          : "Unknown job"}
                      </option>
                    );
                  })}
                  {editingInterview &&
                    !interviewApplications.some(
                      (application) =>
                        application.id === editingInterview.applicationId,
                    ) && (
                      <option value={editingInterview.applicationId}>
                        Current application
                      </option>
                    )}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="interviewType"
                    className="text-sm font-medium"
                  >
                    Interview type
                  </label>
                  <select
                    id="interviewType"
                    value={form.interviewType}
                    onChange={(event) =>
                      updateField(
                        "interviewType",
                        event.target.value as InterviewType | "",
                      )
                    }
                    className="surface-inset w-full px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select type</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="HR">HR</option>
                    <option value="BEHAVIORAL">Behavioral</option>
                    <option value="MANAGERIAL">Managerial</option>
                    <option value="GROUP_DISCUSSION">Group discussion</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="interviewStatus"
                    className="text-sm font-medium"
                  >
                    Status *
                  </label>
                  <select
                    id="interviewStatus"
                    required
                    value={form.status}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.value as InterviewStatus,
                      )
                    }
                    className="surface-inset w-full px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="scheduledAt" className="text-sm font-medium">
                    Date and time
                  </label>
                  <input
                    id="scheduledAt"
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(event) =>
                      updateField("scheduledAt", event.target.value)
                    }
                    className="surface-inset w-full px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="interviewerName"
                    className="text-sm font-medium"
                  >
                    Interviewer name
                  </label>
                  <input
                    id="interviewerName"
                    maxLength={150}
                    value={form.interviewerName}
                    onChange={(event) =>
                      updateField("interviewerName", event.target.value)
                    }
                    placeholder="e.g. Hiring manager"
                    className="surface-inset w-full px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="meetingLink" className="text-sm font-medium">
                    Meeting link
                  </label>
                  <input
                    id="meetingLink"
                    type="url"
                    maxLength={500}
                    value={form.meetingLink}
                    onChange={(event) =>
                      updateField("meetingLink", event.target.value)
                    }
                    placeholder="https://..."
                    className="surface-inset w-full px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="interviewNotes" className="text-sm font-medium">
                  Notes
                </label>
                <textarea
                  id="interviewNotes"
                  rows={3}
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Preparation notes or topics to cover..."
                  className="surface-inset w-full resize-y px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="interviewFeedback"
                  className="text-sm font-medium"
                >
                  Feedback
                </label>
                <textarea
                  id="interviewFeedback"
                  rows={3}
                  value={form.feedback}
                  onChange={(event) =>
                    updateField("feedback", event.target.value)
                  }
                  placeholder="Record feedback after the interview..."
                  className="surface-inset w-full resize-y px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={saving}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    saving ||
                    (!editingInterview && interviewApplications.length === 0)
                  }
                  className="button-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && <RefreshCw size={16} className="animate-spin" />}
                  {saving
                    ? "Saving..."
                    : editingInterview
                      ? "Save changes"
                      : "Schedule interview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <section className="surface-raised p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </section>
  );
}
