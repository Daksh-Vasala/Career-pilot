export default function ResumeUploadLoading() {
  return (
    <div
      aria-busy="true"
      className="mx-auto w-full max-w-3xl space-y-8 p-4 sm:p-6 lg:p-8"
    >
      <span className="sr-only">Loading resume upload form...</span>
      <header>
        <div className="h-4 w-36 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
        <div className="mt-5 h-9 w-48 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#26312E]" />
        <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
      </header>

      <section className="space-y-6 rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-5 dark:border-[#34413C] dark:bg-[#1D2624] sm:p-8">
        <div className="space-y-2">
          <div className="h-4 w-28 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="h-3 w-52 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[#DADDD7] bg-[#F0F0EC] p-6 dark:border-[#34413C] dark:bg-[#1D2624]">
            <div className="size-12 animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="mt-4 h-4 w-36 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="mt-2 h-3 w-44 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#DADDD7]/80 pt-5 dark:border-[#34413C] sm:flex-row sm:justify-end">
          <div className="h-10 w-full animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C] sm:w-24" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-[#DADDD7] dark:bg-[#34413C] sm:w-36" />
        </div>
      </section>
    </div>
  );
}
