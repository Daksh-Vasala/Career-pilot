export default function RoadmapsLoading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8"
    >
      <span className="sr-only">Loading roadmaps...</span>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-4 w-44 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
          <div className="h-8 w-56 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
        </div>
        <div className="h-11 w-40 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#26312E]" />
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="surface-raised space-y-4 p-5 sm:p-6"
          >
            <div className="size-11 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="h-4 w-32 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="h-8 w-12 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          </div>
        ))}
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <div className="h-6 w-40 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="surface-raised space-y-5 p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="size-11 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
                <div className="h-7 w-20 animate-pulse rounded-full bg-[#DADDD7] dark:bg-[#34413C]" />
              </div>
              <div className="h-6 w-48 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="h-4 w-64 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="h-2 w-full animate-pulse rounded-full bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="h-4 w-36 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
