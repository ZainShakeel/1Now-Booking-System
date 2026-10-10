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
        <div className="flex items-center gap-3">
          {/* Notification bell (visual only in this demo). */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span
              aria-hidden="true"
              className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"
            />
          </button>

          {/* Operator account (visual only in this demo). */}
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700"
              aria-hidden="true"
            >
              JD
            </span>
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">
              John Doe
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
