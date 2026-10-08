"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Booking, BookingStatus } from "@/lib/types";
import { assessRisk } from "@/lib/risk";
import { AppHeader } from "@/components/AppHeader";
import { SummaryBar } from "@/components/SummaryBar";
import { StatusTabs } from "@/components/StatusTabs";
import { BookingCard } from "@/components/BookingCard";
import { BookingDetail } from "@/components/BookingDetail";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/Skeleton";
import { Toast } from "@/components/Toast";

type LoadState = "loading" | "error" | "ready";

const EMPTY_MESSAGES: Record<BookingStatus, string> = {
  pending: "No pending requests. You're all caught up.",
  approved: "No approved bookings yet.",
  declined: "No declined bookings yet.",
};

export default function BookingRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [activeTab, setActiveTab] = useState<BookingStatus>("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Per-booking save status so only the active card shows a pending state.
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Set to "1" to demo the error state (mirrors the API's ?fail=1).
  const [forceFail, setForceFail] = useState(false);

  // Confirmation popup shown after a successful approve / decline.
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "info";
  } | null>(null);

  const loadBookings = useCallback(async () => {
    setLoadState("loading");
    try {
      const url = forceFail ? "/api/bookings?fail=1" : "/api/bookings";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as { bookings: Booking[] };
      setBookings(data.bookings);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, [forceFail]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const counts = useMemo<Record<BookingStatus, number>>(
    () => ({
      pending: bookings.filter((b) => b.status === "pending").length,
      approved: bookings.filter((b) => b.status === "approved").length,
      declined: bookings.filter((b) => b.status === "declined").length,
    }),
    [bookings],
  );

  // How many pending requests are High risk — surfaced in the summary bar.
  const highRiskPending = useMemo(
    () =>
      bookings.filter(
        (b) => b.status === "pending" && assessRisk(b).level === "High",
      ).length,
    [bookings],
  );

  const visible = useMemo(() => {
    const list = bookings.filter((b) => b.status === activeTab);
    // Pending requests are sorted by pickup date, soonest first, so the
    // most urgent ones sit at the top.
    if (activeTab === "pending") {
      return [...list].sort(
        (a, b) =>
          new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime(),
      );
    }
    return list;
  }, [bookings, activeTab]);

  const selected = useMemo(
    () => bookings.find((b) => b.id === selectedId) ?? null,
    [bookings, selectedId],
  );

  function selectTab(tab: BookingStatus) {
    setActiveTab(tab);
    setSelectedId(null);
    setSaveError(null);
  }

  async function handleAction(id: string, status: BookingStatus) {
    setSavingId(id);
    setSaveError(null);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = (await res.json()) as { booking: Booking };
      // Update the one booking in place and close the panel.
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? data.booking : b)),
      );
      setSelectedId(null);
      // Confirmation popup naming who it was and what happened.
      setToast({
        message:
          status === "approved"
            ? `Booking approved — ${data.booking.renterName}`
            : `Booking declined — ${data.booking.renterName}`,
        tone: status === "approved" ? "success" : "info",
      });
    } catch {
      setSaveError("Could not save that change. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Booking Requests
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review incoming requests and approve or decline them. Each request
            is flagged by risk so you can decide quickly.
          </p>
        </div>

        {/* Summary strip — only meaningful once data has loaded. */}
        {loadState === "ready" && (
          <div className="mb-5">
            <SummaryBar
              pendingCount={counts.pending}
              highRiskPending={highRiskPending}
            />
          </div>
        )}

        <div className="mb-5 flex items-center justify-between gap-3">
          <StatusTabs active={activeTab} counts={counts} onChange={selectTab} />
          {/* Small helper to demo the error state from the UI. */}
          <label className="flex items-center gap-2 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={forceFail}
              onChange={(e) => setForceFail(e.target.checked)}
              className="h-3.5 w-3.5"
            />
            Simulate load error
          </label>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* List column */}
        <div>
          {loadState === "loading" && <Skeleton />}

          {loadState === "error" && (
            <ErrorState
              message="We couldn't load your booking requests."
              onRetry={loadBookings}
            />
          )}

          {loadState === "ready" &&
            (visible.length === 0 ? (
              <EmptyState message={EMPTY_MESSAGES[activeTab]} />
            ) : (
              <ul className="space-y-3">
                {visible.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isSelected={booking.id === selectedId}
                    onSelect={() => {
                      setSelectedId(booking.id);
                      setSaveError(null);
                    }}
                  />
                ))}
              </ul>
            ))}
        </div>

        {/* Detail column — side-by-side on desktop. */}
        <aside className="hidden lg:block">
          {selected ? (
            <div className="sticky top-8 overflow-hidden rounded-lg border border-slate-200">
              <BookingDetail
                booking={selected}
                isSaving={savingId === selected.id}
                saveError={saveError}
                onAction={(status) => handleAction(selected.id, status)}
                onClose={() => setSelectedId(null)}
              />
            </div>
          ) : (
            <div className="sticky top-8 rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              Select a request to see why it is flagged.
            </div>
          )}
        </aside>
      </div>

      {/* Detail panel — full-screen overlay on mobile. */}
      {selected && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <BookingDetail
            booking={selected}
            isSaving={savingId === selected.id}
            saveError={saveError}
            onAction={(status) => handleAction(selected.id, status)}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}
      </main>

      {/* Confirmation popup after approve / decline. */}
      {toast && (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
