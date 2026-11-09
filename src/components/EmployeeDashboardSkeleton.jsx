const EmployeeDashboardSkeleton = () => (
  <div
    aria-busy="true"
    aria-label="Loading employee dashboard"
    className="space-y-6"
  >
    <span className="sr-only">Loading employee dashboard...</span>

    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="space-y-2">
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-64 max-w-full animate-pulse rounded bg-gray-100" />
      </div>
      <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-3">
          <div className="h-4 w-44 animate-pulse rounded bg-gray-100" />
          <div className="h-7 w-28 animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="space-y-2 sm:text-right">
          <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-100" />
          <div className="ml-auto h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="ml-auto h-3 w-36 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {["clock-in", "worked-time", "break-time"].map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="h-11 w-11 animate-pulse rounded-lg bg-gray-100" />
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 h-4 w-64 max-w-full animate-pulse rounded bg-gray-100" />
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {["clock-in", "start-break", "end-break", "clock-out"].map((item) => (
          <div
            key={item}
            className="h-12 animate-pulse rounded-lg bg-gray-100"
          />
        ))}
      </div>
    </div>
  </div>
);

export default EmployeeDashboardSkeleton;
