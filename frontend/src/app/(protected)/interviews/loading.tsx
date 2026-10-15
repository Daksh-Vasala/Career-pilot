export default function InterviewsLoading() {
  return (
    <div
      aria-busy="true"
      className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8"
    >
      <span className="sr-only">Loading interviews...</span>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-8 w-44 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#26312E]" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
        </div>
        <div className="h-10 w-44 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#26312E]" />
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-5 dark:border-[#34413C] dark:bg-[#1D2624]"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="size-9 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#34413C]" />
            </div>
            <div className="mt-4 h-9 w-16 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-6 w-52 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="h-10 w-full animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#26312E] sm:w-64" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#26312E] sm:w-40" />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <article
              key={item}
              className="space-y-5 rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-5 dark:border-[#34413C] dark:bg-[#1D2624]"
            >
              <div className="flex items-start gap-3">
                <div className="size-11 shrink-0 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                </div>
                <div className="h-7 w-24 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#34413C]" />
              </div>
              <div className="flex gap-2">
                <div className="h-7 w-24 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#34413C]" />
                <div className="h-7 w-36 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#34413C]" />
              </div>
              <div className="h-4 w-44 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="flex justify-end gap-2 border-t border-[#DADDD7]/80 pt-4 dark:border-[#34413C]">
                <div className="h-9 w-20 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#34413C]" />
                <div className="h-9 w-20 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#34413C]" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
