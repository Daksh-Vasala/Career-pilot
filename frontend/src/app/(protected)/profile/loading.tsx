export default function ProfileLoading() {
  return (
    <div
      aria-busy="true"
      className="mx-auto w-full max-w-5xl space-y-6 pb-10"
    >
      <span className="sr-only">Loading profile...</span>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#26312E]" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#26312E]" />
      </header>

      <section className="rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-5 dark:border-[#34413C] dark:bg-[#1D2624] sm:p-7">
        <div className="flex items-center gap-4">
          <div className="size-16 shrink-0 animate-pulse rounded-2xl bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-6 w-48 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="h-4 w-56 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="h-3 w-36 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          </div>
        </div>
      </section>

      {[0, 1, 2].map((section) => (
        <section
          key={section}
          className="space-y-5 rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-5 dark:border-[#34413C] dark:bg-[#1D2624] sm:p-7"
        >
          <div className="space-y-2">
            <div className="h-5 w-44 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="h-4 w-64 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          </div>
          {section === 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {[0, 1, 2, 3].map((field) => (
                <div key={field} className="space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                  <div className="h-5 w-40 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                </div>
              ))}
            </div>
          ) : section === 1 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {[0, 1, 2].map((field) => (
                <div key={field} className="space-y-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                  <div className="h-5 w-48 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
