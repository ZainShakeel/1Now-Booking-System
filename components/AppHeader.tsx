// Branded top bar so the screen reads as a 1Now operator tool, not a
// generic demo. Wordmark on the left, a quiet context label on the right.
export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Simple wordmark: "1" in a brand-blue tile + "Now". */}
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white"
            aria-hidden="true"
          >
            1
          </span>
          <span className="text-base font-semibold tracking-tight text-slate-900">
            1Now
          </span>
          <span className="ml-1 hidden text-sm text-slate-400 sm:inline">
            Operator Dashboard
          </span>
        </div>
        <span className="text-xs font-medium text-slate-500">
          Booking Requests
        </span>
      </div>
    </header>
  );
}
