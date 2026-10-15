export default function ResumeAnalysisLoading() {
  return (
    <div
      aria-busy="true"
      className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8"
    >
      <span className="sr-only">Loading resume analysis...</span>
      <header>
        <div className="h-4 w-36 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
        <div className="mt-5 flex items-start gap-3">
          <div className="size-12 shrink-0 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#26312E]" />
          <div className="space-y-2">
            <div className="h-8 w-64 max-w-full animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#26312E]" />
            <div className="h-4 w-96 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
          </div>
        </div>
      </header>

      <section className="space-y-3 rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-5 dark:border-[#34413C] dark:bg-[#1D2624] sm:p-6">
        <div className="h-4 w-28 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
        <div className="h-11 w-full animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
      </section>

      <section className="space-y-5 rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-5 dark:border-[#34413C] dark:bg-[#1D2624] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="h-4 w-64 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          </div>
          <div className="h-10 w-40 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <article
              key={item}
              className="space-y-4 rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-5 dark:border-[#34413C] dark:bg-[#1D2624]"
            >
              <div className="size-10 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="h-5 w-36 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="h-3 w-48 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="space-y-3">
                {[0, 1, 2].map((row) => (
                  <div key={row} className="flex gap-2">
                    <div className="mt-1 size-2 shrink-0 animate-pulse rounded-full bg-[#DADDD7] dark:bg-[#34413C]" />
                    <div className="h-3 flex-1 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
