// A quick at-a-glance strip above the list. It answers the operator's
// first question — "what needs my attention right now?" — before they
// even read the list. High-risk pending requests are called out.
export function SummaryBar({
  pendingCount,
  highRiskPending,
}: {
  pendingCount: number;
  highRiskPending: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
      <span className="text-slate-700">
        <strong className="font-semibold text-slate-900">{pendingCount}</strong>{" "}
        pending {pendingCount === 1 ? "request" : "requests"}
      </span>
      {highRiskPending > 0 ? (
        <span className="flex items-center gap-1.5 font-medium text-red-700">
          <span aria-hidden="true">▲</span>
          {highRiskPending} high-risk{" "}
          {highRiskPending === 1 ? "request needs" : "requests need"} review
        </span>
      ) : (
        <span className="text-slate-500">No high-risk requests pending.</span>
      )}
    </div>
  );
}
