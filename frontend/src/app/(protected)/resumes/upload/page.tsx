"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { uploadResume } from "@/features/resumes/resume.service";

export default function ResumeUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("My resume");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const selectedFile = input.files?.[0];

    if (!selectedFile) return;

    // Don't trust type alone: Drive files can arrive with an empty type
    const looksLikePdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!looksLikePdf) {
      toast.error("Please select a PDF file.");
      input.value = "";
      return;
    }

    try {
      // Read the whole file now, while the Drive handle is still valid
      const buffer = await selectedFile.arrayBuffer();

      // Optional: confirm it's really a PDF (magic bytes "%PDF")
      const header = new TextDecoder().decode(
        new Uint8Array(buffer.slice(0, 4)),
      );
      if (header !== "%PDF") {
        toast.error("This file doesn't look like a valid PDF.");
        input.value = "";
        return;
      }

      const safeFile = new File([buffer], selectedFile.name || "resume.pdf", {
        type: "application/pdf",
        lastModified: Date.now(),
      });

      setFile(safeFile); // store the in-memory copy, not the original
    } catch (err) {
      console.error("File read failed:", err);
      toast.error("Couldn't read the file. Please try again.");
      input.value = "";
    }
  }

  function removeFile() {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a resume title.");
      return;
    }

    if (!file) {
      toast.error("Please select a PDF file.");
      return;
    }

    setUploading(true);

    try {
      await uploadResume(title.trim(), file);

      toast.success("Resume uploaded successfully.");
      router.push("/resumes");
      router.refresh();
    } catch {
      toast.error("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-4 sm:p-6 lg:p-8">
      <div>
        <Link
          href="/resumes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to resumes
        </Link>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
          Upload Resume
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Add a PDF resume to your CareerPilot workspace.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="surface-raised space-y-6 p-5 sm:p-8"
      >
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Resume title
          </label>

          <input
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Full Stack Developer Resume"
            maxLength={100}
            required
            className="surface-inset w-full px-4 py-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary/40"
          />

          <p className="text-xs text-muted-foreground">
            Give this resume a recognizable name.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="file">
            Resume file
          </label>

          <input
            ref={fileInputRef}
            id="file"
            name="file"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="sr-only"
          />

          {!file ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="surface-inset flex min-h-48 w-full flex-col items-center justify-center border-dashed p-6 text-center transition-colors hover:bg-muted/50"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Upload size={24} />
              </div>

              <span className="mt-4 text-sm font-medium">
                Choose a PDF file
              </span>

              <span className="mt-1 text-xs text-muted-foreground">
                Click to browse your device
              </span>
            </button>
          ) : (
            <div className="surface-raised flex items-center gap-3 p-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText size={22} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB · PDF
                </p>
              </div>

              <button
                type="button"
                onClick={removeFile}
                aria-label="Remove selected file"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Link
            href="/resumes"
            className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={uploading}
            className="button-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload size={17} />
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>
      </form>
    </div>
  );
}
