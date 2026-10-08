"use client";

import { useState } from "react";
import type { Booking, BookingStatus } from "@/lib/types";
import { assessRisk } from "@/lib/risk";
import { RiskBadge } from "./RiskBadge";
import { formatDate, formatPrice, tripLengthDays } from "@/lib/format";

// Detail panel for a single booking. Shows the plain-language reasons
// behind the risk level and the approve / decline actions.
//
// Behaviour the operator relies on:
//  - Decline asks for a quick inline confirmation first.
//  - Buttons show a pending state while the save is in flight.
//  - A failed save shows a clear message and lets them try again.
export function BookingDetail({
  booking,
  isSaving,
  saveError,
  onAction,
  onClose,
}: {
  booking: Booking;
  isSaving: boolean;
  saveError: string | null;
  onAction: (status: BookingStatus) => void;
  onClose: () => void;
}) {
  const [confirmingDecline, setConfirmingDecline] = useState(false);
  const [confirmingApprove, setConfirmingApprove] = useState(false);
  const risk = assessRisk(booking);
  const days = tripLengthDays(booking.pickupDate, booking.returnDate);
  const isPending = booking.status === "pending";
  const isHighRisk = risk.level === "High";

  // High-risk requests need a second look before approving. Low and
  // Medium approve in one click.
  function handleApproveClick() {
    if (isHighRisk) {
      setConfirmingApprove(true);
    } else {
      onAction("approved");
    }
  }

  return (
    <section
      aria-label={`Booking request from ${booking.renterName}`}
      className="flex h-full flex-col bg-white"
    >
      <header className="flex items-start justify-between gap-3 border-b border-slate-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {booking.renterName}
          </h2>
          <p className="text-sm text-slate-500">{booking.carName}</p>
          <div className="mt-2">
            <RiskBadge level={risk.level} />
          </div>
        </div>
        {/* Close is most useful on mobile where the panel is full-screen. */}
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          aria-label="Close details"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-5">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-500">Pickup</dt>
            <dd className="font-medium text-slate-900">
              {formatDate(booking.pickupDate)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Return</dt>
            <dd className="font-medium text-slate-900">
              {formatDate(booking.returnDate)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Trip length</dt>
            <dd className="font-medium text-slate-900">
              {days} {days === 1 ? "day" : "days"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Total price</dt>
            <dd className="font-medium text-slate-900">
              {formatPrice(booking.totalPriceUsd)}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">
            Fraud &amp; risk check
          </h3>
          {/* One box, one line per check. A tick means the check is fine;
              a cross means it's a risk flag. */}
          <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
            {risk.checks.map((check) => (
              <li
                key={check.label}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs font-bold ${
                    check.passed
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {check.passed ? "✓" : "✗"}
                </span>
                {/* Screen-reader word so the status isn't icon-only. */}
                <span className="sr-only">
                  {check.passed ? "Pass:" : "Risk flag:"}
                </span>
                <span
                  className={check.passed ? "text-slate-600" : "text-slate-900"}
                >
                  {check.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions only make sense while the request is still pending. */}
      {isPending && (
        <footer className="border-t border-slate-200 p-5">
          {saveError && (
            <p role="alert" className="mb-3 text-sm font-medium text-red-700">
              {saveError}
            </p>
          )}

          {confirmingDecline ? (
            // Decline confirmation.
            <div>
              <p className="mb-3 text-sm text-slate-700">
                Decline this booking request?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onAction("declined")}
                  disabled={isSaving}
                  className="flex-1 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {isSaving ? "Declining…" : "Yes, decline"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDecline(false)}
                  disabled={isSaving}
                  className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Keep pending
                </button>
              </div>
            </div>
          ) : confirmingApprove ? (
            // High-risk approve confirmation — same style as decline.
            <div>
              <p className="mb-3 text-sm text-slate-700">
                This request has{" "}
                <strong className="font-semibold text-red-700">
                  high risk flags
                </strong>
                . Approve anyway?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onAction("approved")}
                  disabled={isSaving}
                  className="flex-1 rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {isSaving ? "Approving…" : "Approve anyway"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingApprove(false)}
                  disabled={isSaving}
                  className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Default actions.
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleApproveClick}
                disabled={isSaving}
                className="flex-1 rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {isSaving ? "Approving…" : "Approve"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDecline(true)}
                disabled={isSaving}
                className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Decline
              </button>
            </div>
          )}
        </footer>
      )}
    </section>
  );
}
