// Small display helpers shared by the card and detail panel.
//
// Dates are always formatted in a FIXED locale ("en-US") and timezone
// ("UTC"). Without a fixed timezone, the server (often UTC) and the
// browser (the viewer's local zone) can turn the same instant into a
// different calendar day, which React flags as a hydration mismatch.

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", DATE_OPTS);
}

export function formatPrice(usd: number): string {
  return usd.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

// Trip length in whole days, counted from the calendar dates we actually
// SHOW on the card (not the raw timestamps). We snap both dates to their
// UTC calendar day first, so the number always matches "pickup → return"
// as displayed, regardless of the time-of-day on each timestamp.
export function tripLengthDays(pickupIso: string, returnIso: string): number {
  const dayMs = 24 * 60 * 60 * 1000;
  const toUtcDay = (iso: string) => {
    const d = new Date(iso);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  };
  return Math.round((toUtcDay(returnIso) - toUtcDay(pickupIso)) / dayMs);
}
