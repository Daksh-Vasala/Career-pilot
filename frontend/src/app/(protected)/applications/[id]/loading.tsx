export default function ApplicationDetailsLoading() {
  return (
    <div
      aria-busy="true"
      className="mx-auto max-w-4xl space-y-6"
    >
      <span className="sr-only">Loading application details...</span>
      <div className="h-4 w-44 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />

      <section className="space-y-5 rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-6 dark:border-[#34413C] dark:bg-[#1D2624]">
        <div className="space-y-2">
          <div className="h-4 w-36 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-8 w-64 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
        </div>
        <div className="space-y-2 border-t border-[#DADDD7]/80 pt-5 dark:border-[#34413C]">
          <div className="h-5 w-36 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-3 w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-6 dark:border-[#34413C] dark:bg-[#1D2624]">
        <div className="space-y-2">
          <div className="h-6 w-48 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
            </div>
          ))}
          <div className="space-y-2 sm:col-span-2">
            <div className="h-4 w-16 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="h-32 w-full animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
          </div>
        </div>
        <div className="flex justify-between border-t border-[#DADDD7]/80 pt-5 dark:border-[#34413C]">
          <div className="h-10 w-40 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-10 w-36 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
        </div>
      </section>
      <div className="h-3 w-64 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
    </div>
  );
}
