// Loading skeleton: a few pulsing placeholder cards shown while the
// list is being fetched.
export function Skeleton() {
  return (
    <ul className="space-y-3" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <li
          key={i}
          className="animate-pulse rounded-lg border border-slate-200 bg-white p-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-5 w-20 rounded-full bg-slate-200" />
          </div>
          <div className="mt-3 h-3 w-40 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-24 rounded bg-slate-200" />
        </li>
      ))}
    </ul>
  );
}
