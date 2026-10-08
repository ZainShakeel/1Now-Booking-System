// Error state with a Retry button. Shown when loading the list fails.
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-16 text-center"
    >
      <p className="text-3xl" aria-hidden="true">
        ⚠️
      </p>
      <p className="mt-3 text-sm font-medium text-red-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        Retry
      </button>
    </div>
  );
}
