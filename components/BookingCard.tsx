import type { Booking } from "@/lib/types";
import { assessRisk } from "@/lib/risk";
import { RiskBadge } from "./RiskBadge";
import { formatDate, formatPrice, tripLengthDays } from "@/lib/format";

// One booking request in the list. Clickable to open the detail panel.
// Rendered as a button so it is keyboard reachable and announced.
export function BookingCard({
  booking,
  isSelected,
  onSelect,
}: {
  booking: Booking;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const risk = assessRisk(booking);
  const days = tripLengthDays(booking.pickupDate, booking.returnDate);

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        className={`w-full rounded-lg border bg-white p-4 text-left transition-shadow hover:shadow-sm ${
          isSelected
            ? "border-blue-500 ring-1 ring-blue-500"
            : "border-slate-200"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900">{booking.renterName}</p>
            <p className="text-sm text-slate-500">{booking.carName}</p>
          </div>
          <RiskBadge level={risk.level} />
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600">
          <div>
            <dt className="sr-only">Trip dates</dt>
            <dd>
              {formatDate(booking.pickupDate)} → {formatDate(booking.returnDate)}
            </dd>
          </div>
          <div className="text-right">
            <dt className="sr-only">Total price</dt>
            <dd className="font-medium text-slate-900">
              {formatPrice(booking.totalPriceUsd)}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Trip length</dt>
            <dd>
              {days} {days === 1 ? "day" : "days"}
            </dd>
          </div>
        </dl>
      </button>
    </li>
  );
}
