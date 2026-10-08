import type { BookingStatus } from "@/lib/types";

const TABS: { key: BookingStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "declined", label: "Declined" },
];

// Pending / Approved / Declined tabs, each showing a live count.
// Implemented as a proper tablist for keyboard and screen-reader support.
export function StatusTabs({
  active,
  counts,
  onChange,
}: {
  active: BookingStatus;
  counts: Record<BookingStatus, number>;
  onChange: (status: BookingStatus) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Booking request status"
      className="flex gap-1 border-b border-slate-200"
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
