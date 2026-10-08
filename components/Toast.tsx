"use client";

import { useEffect } from "react";

// A small confirmation popup shown after an approve / decline succeeds.
// It auto-dismisses after a few seconds, and can be closed by hand.
export function Toast({
  message,
  tone,
  onClose,
}: {
  message: string;
  tone: "success" | "info";
  onClose: () => void;
}) {
  // Auto-dismiss after 3.5s.
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icon = tone === "success" ? "✓" : "✕";
  const iconClasses =
    tone === "success"
      ? "bg-green-500 text-white"
      : "bg-slate-500 text-white";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
    >
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-2.5 pl-2.5 pr-4 shadow-lg">
        <span
          aria-hidden="true"
          className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm font-bold ${iconClasses}`}
        >
          {icon}
        </span>
        <span className="text-sm font-medium text-slate-900">{message}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="ml-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
