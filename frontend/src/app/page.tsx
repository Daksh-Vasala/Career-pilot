
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  CalendarDays,
  ChartNoAxesColumn,
  Sparkles,
  CheckCircle2,
  Target,
  ShieldCheck,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const features = [
  {
    icon: BriefcaseBusiness,
    title: "Application tracking",
    text: "Track job applications, monitor progress, and keep follow-ups from slipping through the cracks.",
    label: "Stay organized",
  },
  {
    icon: FileText,
    title: "AI resume review",
    text: "Get AI-powered feedback on your resume and identify opportunities to strengthen your profile.",
    label: "Improve your resume",
  },
  {
    icon: CalendarDays,
    title: "Interview planning",
    text: "Keep interview schedules, preparation notes, and feedback together in one workspace.",
    label: "Prepare with purpose",
  },
];

const applications = [
  {
    company: "Acme Corporation",
    role: "Frontend Developer",
    status: "Interview",
    date: "Oct 08",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    company: "Vertex Labs",
    role: "React Developer",
    status: "Applied",
    date: "Oct 06",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    company: "Northstar Digital",
    role: "Software Engineer",
    status: "In review",
    date: "Oct 04",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

const card =
  "rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg";

const button =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10"
        >
          <Link
            href="/"
            aria-label="CareerPilot home"
            className="shrink-0 text-2xl font-bold tracking-tight"
          >
            CareerPilot<span className="text-primary">.</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="transition-colors hover:text-foreground"
            >
              How it works
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ModeToggle />
            <Link href="/login" className="hidden rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary sm:inline-flex">
              Log in
            </Link>
            <Link href="/register" className={button}>
              Get started
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-120 max-w-5xl rounded-full bg-primary/5 blur-3xl"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles aria-hidden="true" className="size-4" />
              Your career, in one place
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Take control of your job search.
              <span className="mt-2 block text-primary">
                Move forward with confidence.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Manage applications, get AI-powered resume feedback, and prepare
              for interviews with a career workspace built to keep you focused.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className={`${button} w-full sm:w-auto`}
              >
                Get started for free
                <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Explore features
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  aria-hidden="true"
                  className="size-4 text-primary"
                />
                Free to get started
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  aria-hidden="true"
                  className="size-4 text-primary"
                />
                One organized workspace
              </span>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-4xl bg-primary/5 blur-2xl"
            />

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/5 dark:shadow-black/20">
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ChartNoAxesColumn
                      aria-hidden="true"
                      className="size-5"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">Career overview</h2>
                    <p className="text-xs text-muted-foreground">
                      Your job search at a glance
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                  Sample preview
                </span>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { label: "Applications", value: "12", icon: BriefcaseBusiness },
                    { label: "Interviews", value: "04", icon: CalendarDays },
                    { label: "Resumes", value: "03", icon: FileText },
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="min-w-0 rounded-xl border border-border bg-background p-3 sm:p-4"
                    >
                      <Icon
                        aria-hidden="true"
                        className="mb-3 size-4 text-primary"
                      />
                      <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {value}
                      </p>
                      <p className="mt-1 text-[11px] leading-4 text-muted-foreground sm:text-xs">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-7">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-semibold">Recent applications</h3>
                    <span className="text-xs text-muted-foreground">
                      Example data
                    </span>
                  </div>

                  <div className="space-y-2">
                    {applications.map((app) => (
                      <div
                        key={app.company}
                        className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary/50"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary font-semibold">
                          {app.company.charAt(0)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {app.company}
                          </p>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {app.role}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold sm:text-xs ${app.color}`}
                          >
                            {app.status}
                          </span>
                          <span className="text-[10px] text-muted-foreground sm:text-xs">
                            {app.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-xl bg-primary/5 p-3 text-sm">
                  <Target
                    aria-hidden="true"
                    className="size-4 shrink-0 text-primary"
                  />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Stay focused.
                    </span>{" "}
                    Keep your next career move organized.
                  </p>
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Illustrative preview · All figures are sample data
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-24 border-t border-border bg-secondary/20 px-5 py-20 sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Everything in one place
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Less juggling. More progress.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Spend less time managing the process and more time preparing for
              your next opportunity.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text, label }) => (
              <article key={title} className={`${card} p-6 sm:p-7`}>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-6" />
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-primary">
                  {label}
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works / CTA */}
      <section
        id="how-it-works"
        className="scroll-mt-24 px-5 py-20 sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 sm:p-10 lg:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
            />

            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <ShieldCheck aria-hidden="true" className="size-4" />
                  A more organized job search
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Your next move starts here.
                </h2>
                <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
                  Bring your applications, resume feedback, and interview
                  preparation together in a workspace designed around your
                  career goals.
                </p>
              </div>

              <Link
                href="/register"
                className={`${button} w-full shrink-0 md:w-auto`}
              >
                Create your account
                <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight"
            aria-label="CareerPilot home"
          >
            CareerPilot<span className="text-primary">.</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © 2026 CareerPilot. Built for your next move.
          </p>
        </div>
      </footer>
    </main>
  );
}
