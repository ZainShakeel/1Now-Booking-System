// Reusable empty state. Shown when a tab has no bookings.
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <p className="text-3xl" aria-hidden="true">
        📭
      </p>
      <p className="mt-3 text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}
