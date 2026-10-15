export default function NewRoadmapLoading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto w-full max-w-3xl space-y-7 p-4 sm:p-6 lg:p-8"
    >
      <span className="sr-only">Loading roadmap form...</span>
      <div className="h-4 w-36 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />

      <header className="space-y-3">
        <div className="size-12 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#26312E]" />
        <div className="h-8 w-64 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
      </header>

      <section className="surface-raised space-y-7 p-5 sm:p-7">
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-28 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-4 w-60 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-11 w-32 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
        </div>
        <div className="flex justify-end border-t border-[#DADDD7]/80 pt-5 dark:border-[#34413C]">
          <div className="h-11 w-40 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
        </div>
      </section>
    </main>
  );
}
