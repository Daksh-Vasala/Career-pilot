import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  CalendarDays,
  ChartNoAxesColumn,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const features = [
  {
    icon: BriefcaseBusiness,
    title: "Application tracking",
    text: "Keep every application and follow-up organized.",
  },
  {
    icon: FileText,
    title: "AI resume review",
    text: "Improve your resume with useful insights.",
  },
  {
    icon: CalendarDays,
    title: "Interview planning",
    text: "Organize interviews, notes, and feedback.",
  },
];

const applications = [
  {
    company: "Acme Corporation",
    role: "Frontend Developer",
    status: "Interview",
    date: "Oct 08",
  },
  {
    company: "Vertex Labs",
    role: "React Developer",
    status: "Applied",
    date: "Oct 06",
  },
  {
    company: "Northstar Digital",
    role: "Software Engineer",
    status: "Review",
    date: "Oct 04",
  },
];

const card =
  "rounded-2xl border border-white/70 bg-card shadow-[6px_6px_14px_#D7D8D2,-6px_-6px_14px_#FFFFFF] dark:border-border dark:shadow-[6px_6px_14px_#101614,-6px_-6px_14px_#222D29]";

const inset =
  "rounded-xl bg-background shadow-[inset_3px_3px_7px_#D7D8D2,inset_-3px_-3px_7px_#FFFFFF] dark:shadow-[inset_3px_3px_7px_#101614,inset_-3px_-3px_7px_#222D29]";

const button =
  "inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          CareerPilot<span className="text-primary">.</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
          <Link href="#features" className="hover:text-primary">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-primary">
            How it works
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Link href="/register" className={button}>
            Get Started <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
        <div>
          <div
            className={`mb-7 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-primary ${card}`}
          >
            <span className="size-2 rounded-full bg-primary" />
            Your career, organized.
          </div>

          <h1 className="max-w-xl text-5xl font-semibold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
            Navigate your career.{" "}
            <span className="text-primary">Land your next opportunity.</span>
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground">
            Track applications, optimize your resume with AI, and prepare for
            interviews — all from one focused workspace.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/register" className={button}>
              Get Started — It&apos;s Free
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center rounded-xl border border-border px-5 py-3 font-medium transition-colors hover:bg-secondary"
            >
              Explore features
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            One workspace. Every step of your job search.
          </p>
        </div>

        <div
          className={`rounded-3xl border border-white/70 bg-card p-5 sm:p-8 dark:border-border ${card}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">YOUR WORKSPACE</p>
              <h2 className="mt-1 text-2xl font-semibold">Career overview</h2>
            </div>
            <div className={`p-3 text-primary ${inset}`}>
              <ChartNoAxesColumn className="size-6" />
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3">
            {[
              { label: "Applications", value: "12" },
              { label: "Interviews", value: "04" },
              { label: "Resumes", value: "03" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border p-3 sm:p-4"
              >
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-7">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Recent applications</h3>
              <span className="text-xs text-muted-foreground">Preview</span>
            </div>

            <div className="space-y-2">
              {applications.map((app) => (
                <div
                  key={app.company}
                  className="flex items-center gap-3 rounded-xl border border-border p-3"
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center font-semibold text-primary ${inset}`}
                  >
                    {app.company.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {app.company}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {app.role}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-medium text-primary">
                      {app.status}
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {app.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Illustrative dashboard · Sample data
          </p>
        </div>
      </section>

      <section
        id="features"
        className="border-t border-border px-6 py-20 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Built for your next move
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Less juggling. More progress.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
            The tools you need to stay organized and move through your job
            search with confidence.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className={card}>
                <div className="p-7">
                  <div className={`inline-flex p-3 text-primary ${inset}`}>
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 pb-20 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-secondary p-8 sm:p-12 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Your next move starts here.
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
              Bring your applications, resumes, and interviews into one
              organized workspace.
            </p>
          </div>
          <Link href="/register" className={button}>
            Get Started <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-7 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <Link href="/" className="font-semibold text-foreground">
            CareerPilot.
          </Link>
          <p>
            © {new Date().getFullYear()} CareerPilot. Built for your next move.
          </p>
        </div>
      </footer>
    </main>
  );
}
