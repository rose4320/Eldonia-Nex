export default function SettingsLoading() {
  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <div className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-48 animate-pulse rounded-lg bg-[#0f1624]/80" />
        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <div className="hidden h-64 w-52 animate-pulse rounded-lg bg-[#0f1624]/60 lg:block" />
          <div className="min-w-0 flex-1 space-y-6">
            <div className="h-32 animate-pulse rounded-lg bg-[#0f1624]/60" />
            <div className="h-48 animate-pulse rounded-lg bg-[#0f1624]/60" />
            <div className="h-64 animate-pulse rounded-lg bg-[#0f1624]/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
