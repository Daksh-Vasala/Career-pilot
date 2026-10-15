export default function RoadmapDetailLoading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto w-full max-w-5xl space-y-7 p-4 sm:p-6 lg:p-8"
    >
      <span className="sr-only">Loading roadmap details...</span>
      <div className="h-4 w-28 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />

      <section className="space-y-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="h-4 w-40 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
            <div className="h-9 w-64 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
            <div className="h-4 w-52 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
          </div>
          <div className="h-11 w-44 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#26312E]" />
        </div>
      </section>

      <section className="surface-raised space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="h-8 w-12 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          </div>
          <div className="size-12 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
        </div>
        <div className="h-3 w-full animate-pulse rounded-full bg-[#DADDD7] dark:bg-[#34413C]" />
        <div className="h-4 w-48 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-48 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
        </div>
        {[0, 1, 2].map((item) => (
          <article
            key={item}
            className="surface-raised flex items-start gap-4 p-4 sm:p-5"
          >
            <div className="mt-0.5 size-7 shrink-0 animate-pulse rounded-full bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-3 w-24 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="h-5 w-56 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="h-4 w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="h-4 w-32 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
