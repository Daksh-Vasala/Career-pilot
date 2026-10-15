export default function ResumesLoading() {
  return (
    <div
      aria-busy="true"
      className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8"
    >
      <span className="sr-only">Loading resumes...</span>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-8 w-44 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#26312E]" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-36 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#26312E]" />
          <div className="h-10 w-32 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#26312E]" />
        </div>
      </header>

      <section className="rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-5 dark:border-[#34413C] dark:bg-[#1D2624] sm:p-6">
        <div className="flex items-center gap-4">
          <div className="size-12 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="h-7 w-16 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
          <div className="h-4 w-16 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <article
              key={item}
              className="space-y-5 rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-5 dark:border-[#34413C] dark:bg-[#1D2624]"
            >
              <div className="flex items-start gap-3">
                <div className="size-11 shrink-0 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                </div>
                <div className="h-6 w-10 animate-pulse rounded-md bg-[#DADDD7] dark:bg-[#34413C]" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-3 w-16 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                  <div className="h-3 w-20 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 w-16 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                  <div className="h-3 w-24 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                </div>
              </div>
              <div className="flex gap-2 border-t border-[#DADDD7]/80 pt-4 dark:border-[#34413C]">
                <div className="h-9 flex-1 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
                <div className="size-9 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#34413C]" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
