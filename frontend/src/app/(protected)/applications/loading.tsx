export default function ApplicationsLoading() {
  return (
    <div aria-busy="true" className="space-y-6">
      <span className="sr-only">Loading applications...</span>
      <header className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#26312E]" />
        <div className="h-4 w-64 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
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
            <div className="mt-2 h-3 w-36 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-4 dark:border-[#34413C] dark:bg-[#1D2624]">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="h-10 flex-1 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C] sm:w-40" />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] dark:border-[#34413C] dark:bg-[#1D2624]">
        <div className="space-y-2 border-b border-[#DADDD7]/80 px-5 py-4 dark:border-[#34413C]">
          <div className="h-5 w-40 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-3 w-28 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
        </div>
        <div className="divide-y divide-[#DADDD7]/80 dark:divide-[#34413C]">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 size-10 shrink-0 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#34413C]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-52 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                  <div className="h-3 w-32 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                  <div className="h-3 w-40 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-7 w-20 animate-pulse rounded-full bg-[#DADDD7] dark:bg-[#34413C]" />
                <div className="h-4 w-24 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
