"use client";

import { useCallback, useState } from "react";
import {
  BriefcaseBusiness,
  Plus,
  Search,
  MapPin,
  Building2,
  Pencil,
  Trash2,
  RefreshCw,
  ExternalLink,
  X,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "@/features/jobs/job.service";
import type { CreateJobData, UpdateJobData } from "@/features/jobs/job.service";
import type { Job } from "@/features/jobs/job.types";
import { createApplication } from "@/features/applications/application.service";
import type {
  Application,
  ApplicationStatus,
} from "@/features/applications/application.types";

interface JobsClientProps {
  initialJobs: Job[];
  initialApplications: Application[];
}

interface JobFormData {
  companyName: string;
  jobTitle: string;
  jobUrl: string;
  location: string;
  employmentType: string;
  salary: string;
  description: string;
}

const emptyForm: JobFormData = {
  companyName: "",
  jobTitle: "",
  jobUrl: "",
  location: "",
  employmentType: "",
  salary: "",
  description: "",
};

const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getFormData(job: Job): JobFormData {
  return {
    companyName: job.companyName,
    jobTitle: job.jobTitle,
    jobUrl: job.jobUrl ?? "",
    location: job.location ?? "",
    employmentType: job.employmentType ?? "",
    salary: job.salary ?? "",
    description: job.description ?? "",
  };
}

export function JobsClient({
  initialJobs,
  initialApplications,
}: JobsClientProps) {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [form, setForm] = useState<JobFormData>(emptyForm);
  const [confirmation, setConfirmation] = useState<{
    type: "apply" | "delete";
    job: Job;
  } | null>(null);

  const applicationsByJobId = new Map(
    applications.map((application) => [application.jobId, application]),
  );

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await getJobs();
      setJobs(data);
    } catch {
      setError(true);
      toast.error("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  function openCreateDialog() {
    setEditingJob(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(job: Job) {
    setEditingJob(job);
    setForm(getFormData(job));
    setDialogOpen(true);
  }

  function closeDialog() {
    if (saving) return;
    setDialogOpen(false);
    setEditingJob(null);
    setForm(emptyForm);
  }

  function updateField<K extends keyof JobFormData>(
    field: K,
    value: JobFormData[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const commonData = {
      companyName: form.companyName.trim(),
      jobTitle: form.jobTitle.trim(),
      jobUrl: form.jobUrl.trim(),
      location: form.location.trim(),
      employmentType: form.employmentType.trim(),
      salary: form.salary.trim(),
      description: form.description.trim(),
    };

    try {
      if (editingJob) {
        const data: UpdateJobData = {
          companyName: commonData.companyName,
          jobTitle: commonData.jobTitle,
          jobUrl: commonData.jobUrl || null,
          location: commonData.location || null,
          employmentType: commonData.employmentType || null,
          salary: commonData.salary || null,
          description: commonData.description || null,
        };

        const updatedJob = await updateJob(editingJob.id, data);

        setJobs((current) =>
          current.map((job) => (job.id === updatedJob.id ? updatedJob : job)),
        );

        toast.success("Job updated successfully.");
      } else {
        const data: CreateJobData = {
          companyName: commonData.companyName,
          jobTitle: commonData.jobTitle,
          ...(commonData.jobUrl && { jobUrl: commonData.jobUrl }),
          ...(commonData.location && { location: commonData.location }),
          ...(commonData.employmentType && {
            employmentType: commonData.employmentType,
          }),
          ...(commonData.salary && { salary: commonData.salary }),
          ...(commonData.description && {
            description: commonData.description,
          }),
        };

        const createdJob = await createJob(data);
        setJobs((current) => [createdJob, ...current]);

        toast.success("Job added successfully.");
      }

      setDialogOpen(false);
      setEditingJob(null);
      setForm(emptyForm);
    } catch {
      toast.error(editingJob ? "Failed to update job." : "Failed to add job.");
    } finally {
      setSaving(false);
    }
  }

  function handleMarkAsApplied(job: Job) {
    if (applicationsByJobId.has(job.id) || applyingId !== null) {
      return;
    }

    setConfirmation({ type: "apply", job });
  }

  async function confirmMarkAsApplied(job: Job) {
    setApplyingId(job.id);

    try {
      const application = await createApplication({
        jobId: job.id,
        status: "APPLIED",
      });

      setApplications((current) => {
        if (current.some((item) => item.jobId === job.id)) {
          return current;
        }

        return [application as Application, ...current];
      });

      toast.success("Application added successfully.");
      setConfirmation(null);
      router.refresh();
    } catch {
      toast.error(
        "Could not create the application. It may already exist; refresh the page and try again.",
      );
    } finally {
      setApplyingId(null);
    }
  }

  function handleDelete(job: Job) {
    setConfirmation({ type: "delete", job });
  }

  async function confirmDelete(job: Job) {
    setDeletingId(job.id);

    try {
      await deleteJob(job.id);

      setJobs((current) => current.filter((item) => item.id !== job.id));
      setApplications((current) =>
        current.filter((item) => item.jobId !== job.id),
      );

      toast.success("Job deleted successfully.");
      setConfirmation(null);
    } catch {
      toast.error("Failed to delete job.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const query = search.trim().toLowerCase();

    return (
      job.companyName.toLowerCase().includes(query) ||
      job.jobTitle.toLowerCase().includes(query) ||
      (job.location ?? "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            My Jobs
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage opportunities and track the ones you apply for.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateDialog}
          className="button-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium"
        >
          <Plus size={18} />
          Add Job
        </button>
      </header>

      <section className="surface-raised p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BriefcaseBusiness size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Jobs</p>
            <p className="text-2xl font-semibold">
              {loading ? "—" : jobs.length}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Your opportunities</h2>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jobs..."
              aria-label="Search jobs"
              className="surface-inset w-full py-2.5 pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-2xl border border-border bg-muted/40"
              />
            ))}
          </div>
        ) : error ? (
          <div className="surface-raised p-8 text-center">
            <p className="text-muted-foreground">
              We couldn&apos;t load your jobs.
            </p>
            <button
              type="button"
              onClick={() => void fetchJobs()}
              className="button-primary mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="surface-raised px-6 py-14 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BriefcaseBusiness size={28} />
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              {jobs.length === 0 ? "No jobs yet" : "No matching jobs"}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {jobs.length === 0
                ? "Add a job opportunity to start organizing your job search."
                : "Try another search term."}
            </p>
            {jobs.length === 0 && (
              <button
                type="button"
                onClick={openCreateDialog}
                className="button-primary mt-5 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
              >
                <Plus size={17} />
                Add your first job
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => {
              const application = applicationsByJobId.get(job.id);
              const isApplying = applyingId === job.id;

              return (
                <article
                  key={job.id}
                  className="surface-raised surface-raised-hover flex min-w-0 flex-col p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building2 size={22} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="truncate font-semibold"
                        title={job.jobTitle}
                      >
                        {job.jobTitle}
                      </h3>
                      <p
                        className="mt-1 truncate text-sm text-muted-foreground"
                        title={job.companyName}
                      >
                        {job.companyName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.location && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-xs">
                        <MapPin size={13} />
                        {job.location}
                      </span>
                    )}
                    {job.employmentType && (
                      <span className="rounded-lg bg-muted px-2.5 py-1.5 text-xs">
                        {job.employmentType}
                      </span>
                    )}
                  </div>

                  {job.salary && (
                    <p className="mt-3 text-sm font-medium">{job.salary}</p>
                  )}
                  {job.description && (
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {job.description}
                    </p>
                  )}

                  {application && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-sm">
                      <CheckCircle2
                        size={16}
                        className="shrink-0 text-primary"
                      />
                      <span>
                        Application:{" "}
                        <span className="font-medium">
                          {statusLabels[application.status]}
                        </span>
                      </span>
                    </div>
                  )}

                  <div className="mt-auto pt-5">
                    <p className="text-xs text-muted-foreground">
                      Added {formatDate(job.createdAt)}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                      {job.jobUrl && (
                        <a
                          href={job.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open job listing for ${job.jobTitle}`}
                          title="Open job listing"
                          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <ExternalLink size={17} />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => openEditDialog(job)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(job)}
                        disabled={deletingId === job.id}
                        aria-label={`Delete ${job.jobTitle} at ${job.companyName}`}
                        title="Delete job"
                        className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === job.id ? (
                          <RefreshCw size={17} className="animate-spin" />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>

                      {application ? (
                        <button
                          type="button"
                          onClick={() => router.push("/applications")}
                          className="button-primary inline-flex w-full items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium"
                        >
                          <ClipboardList size={16} />
                          View Application
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void handleMarkAsApplied(job)}
                          disabled={applyingId !== null}
                          className="button-primary inline-flex w-full items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isApplying ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                          {isApplying
                            ? "Creating application..."
                            : "Mark as Applied"}
                        </button>
                      )}
                    </div>
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
          if (!open && applyingId === null && deletingId === null) {
            setConfirmation(null);
          }
        }}
        title={
          confirmation?.type === "apply" ? "Mark as applied?" : "Delete job?"
        }
        description={
          confirmation?.type === "apply"
            ? `Have you submitted your application for ${confirmation.job.jobTitle} at ${confirmation.job.companyName}?`
            : confirmation
              ? `Are you sure you want to delete "${confirmation.job.jobTitle}" at ${confirmation.job.companyName}? Associated applications and interviews may also be deleted.`
              : ""
        }
        confirmLabel={
          confirmation?.type === "apply" ? "Mark as applied" : "Delete job"
        }
        variant={confirmation?.type === "apply" ? "default" : "destructive"}
        onConfirm={() => {
          if (confirmation?.type === "apply") {
            void confirmMarkAsApplied(confirmation.job);
          } else if (confirmation) {
            void confirmDelete(confirmation.job);
          }
        }}
        isPending={applyingId !== null || deletingId !== null}
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
            aria-labelledby="job-dialog-title"
            className="surface-modal my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto p-5 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="job-dialog-title" className="text-xl font-semibold">
                  {editingJob ? "Edit Job" : "Add Job"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {editingJob
                    ? "Update the details of this opportunity."
                    : "Save a job opportunity to your collection."}
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="companyName" className="text-sm font-medium">
                    Company name *
                  </label>
                  <input
                    id="companyName"
                    required
                    maxLength={150}
                    value={form.companyName}
                    onChange={(event) =>
                      updateField("companyName", event.target.value)
                    }
                    placeholder="e.g. Google"
                    className="surface-inset w-full px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="jobTitle" className="text-sm font-medium">
                    Job title *
                  </label>
                  <input
                    id="jobTitle"
                    required
                    maxLength={150}
                    value={form.jobTitle}
                    onChange={(event) =>
                      updateField("jobTitle", event.target.value)
                    }
                    placeholder="e.g. Backend Developer"
                    className="surface-inset w-full px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="jobUrl" className="text-sm font-medium">
                    Job URL
                  </label>
                  <input
                    id="jobUrl"
                    type="url"
                    maxLength={1000}
                    value={form.jobUrl}
                    onChange={(event) =>
                      updateField("jobUrl", event.target.value)
                    }
                    placeholder="https://..."
                    className="surface-inset w-full px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  <input
                    id="location"
                    maxLength={150}
                    value={form.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    placeholder="e.g. Ahmedabad / Remote"
                    className="surface-inset w-full px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="employmentType"
                    className="text-sm font-medium"
                  >
                    Employment type
                  </label>
                  <select
                    id="employmentType"
                    value={form.employmentType}
                    onChange={(event) =>
                      updateField("employmentType", event.target.value)
                    }
                    className="surface-inset w-full px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="salary" className="text-sm font-medium">
                    Salary
                  </label>
                  <input
                    id="salary"
                    maxLength={100}
                    value={form.salary}
                    onChange={(event) =>
                      updateField("salary", event.target.value)
                    }
                    placeholder="e.g. ₹4–6 LPA"
                    className="surface-inset w-full px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Responsibilities, requirements, or notes..."
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
                  disabled={saving}
                  className="button-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && <RefreshCw size={16} className="animate-spin" />}
                  {saving
                    ? "Saving..."
                    : editingJob
                      ? "Save changes"
                      : "Add Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
