const navigationItems = Array.from({ length: 6 }, (_, index) => index);

export default function AuthSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading workspace"
      className="flex h-dvh min-h-0 w-full overflow-hidden bg-gray-50"
    >
      <aside
        aria-hidden="true"
        className="hidden h-full w-19 shrink-0 flex-col border-r border-gray-200 bg-white p-3 lg:flex"
      >
        <div className="flex h-10 w-10 shrink-0 animate-pulse rounded-xl bg-indigo-100" />

        <div className="mt-8 flex-1 space-y-3">
          {navigationItems.map((item) => (
            <div
              key={item}
              className={`flex h-12 items-center justify-center rounded-xl ${
                item === 0 ? "bg-indigo-50" : ""
              }`}
            >
              <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200" />
            </div>
          ))}
        </div>

        <div className="flex h-12 items-center justify-center border-t border-gray-100 pt-3">
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header
          aria-hidden="true"
          className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-3 sm:px-4 lg:hidden"
        >
          <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-9 w-9 animate-pulse rounded-xl bg-indigo-100" />
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
          </div>
        </header>

        <main
          aria-hidden="true"
          className="min-h-0 min-w-0 flex-1 overflow-y-auto p-2 sm:p-4 md:p-6"
        >
          <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="space-y-3">
                <div className="h-7 w-48 max-w-full animate-pulse rounded-lg bg-gray-200" />
                <div className="h-4 w-64 max-w-full animate-pulse rounded bg-gray-100" />
              </div>
              <div className="h-10 w-32 animate-pulse rounded-xl bg-indigo-100" />
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 xl:grid-cols-3">
              {navigationItems.slice(0, 2).map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                  <div className="mt-5 h-8 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="mt-3 h-3 w-36 max-w-full animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="h-5 w-40 max-w-full animate-pulse rounded bg-gray-200" />
                <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
              </div>

              <div className="space-y-5">
                {navigationItems.slice(0, 4).map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-100" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
                    </div>
                    <div className="hidden h-7 w-20 animate-pulse rounded-md bg-gray-100 sm:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <span className="sr-only">Loading workspace</span>
    </div>
  );
}
