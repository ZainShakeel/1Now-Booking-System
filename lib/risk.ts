import type { Booking, RiskResult, RiskLevel, RiskCheck } from "./types";

// Pure risk scoring. No React, no network, no clock side effects beyond
// the `now` we pass in. Given a booking, add up the weight of each risk
// signal that applies and map the total to Low / Medium / High.
//
// Weights (agreed with the operator view in mind):
//   High signals   = 4  (ID not verified, insurance not confirmed)
//   Medium signals = 2  (new account, imminent pickup, long trip on pricey car)
//   Low signal     = 1  (first-time renter)
//
// Thresholds:
//   score >= 4        -> High
//   score 2 or 3      -> Medium
//   score 0 or 1      -> Low
//
// Why these numbers: a single unverified ID or missing insurance (4)
// is High on its own, as it should be. But a normal brand-new customer
// — account under 7 days old (2) plus first-time renter (1) = 3 —
// lands at Medium, not High. New customers are the operator's bread
// and butter; flagging every one of them as High would be useless.
//
// The function returns a full checklist (`checks`): every signal, shown
// as passed (tick) or failed (cross), so the operator sees the whole
// fraud-check at a glance. Only failed checks add to the score.

const HIGH_WEIGHT = 4;
const MEDIUM_WEIGHT = 2;
const LOW_WEIGHT = 1;

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
const HIGH_VALUE_CAR_USD = 60_000;

export function assessRisk(booking: Booking, now: Date = new Date()): RiskResult {
  const checks: RiskCheck[] = [];
  let score = 0;

  // Each check is one line in the fraud-check box. `passed: true` means
  // it's fine (tick); `passed: false` means it's a risk flag (cross) and
  // adds its weight to the score. We list every check either way so the
  // operator sees the full picture, not just the problems.

  // --- High-weight checks ---
  const idOk = booking.idVerified;
  if (!idOk) score += HIGH_WEIGHT;
  checks.push({
    passed: idOk,
    label: idOk
      ? "Driver's license verified"
      : "Driver's license not verified",
  });

  const insuranceOk = booking.insuranceConfirmed;
  if (!insuranceOk) score += HIGH_WEIGHT;
  checks.push({
    passed: insuranceOk,
    label: insuranceOk ? "Insurance confirmed" : "Insurance not confirmed",
  });

  // --- Medium-weight checks ---
  const accountAgeMs = now.getTime() - new Date(booking.accountCreatedAt).getTime();
  const accountOk = accountAgeMs >= SEVEN_DAYS_MS;
  if (!accountOk) score += MEDIUM_WEIGHT;
  checks.push({
    passed: accountOk,
    label: accountOk
      ? "Established account (over 7 days old)"
      : "New account (under 7 days old)",
  });

  const timeToPickupMs = new Date(booking.pickupDate).getTime() - now.getTime();
  const pickupOk = timeToPickupMs >= ONE_DAY_MS;
  if (!pickupOk) score += MEDIUM_WEIGHT;
  checks.push({
    passed: pickupOk,
    label: pickupOk
      ? "Pickup is more than 24 hours away"
      : "Last-minute pickup (within 24 hours)",
  });

  const tripLengthMs =
    new Date(booking.returnDate).getTime() - new Date(booking.pickupDate).getTime();
  const longTripOnPriceyCar =
    tripLengthMs > FOURTEEN_DAYS_MS && booking.carValueUsd > HIGH_VALUE_CAR_USD;
  if (longTripOnPriceyCar) score += MEDIUM_WEIGHT;
  checks.push({
    passed: !longTripOnPriceyCar,
    label: longTripOnPriceyCar
      ? "Long trip (14+ days) on a high-value car"
      : "Trip length and car value are normal",
  });

  // --- Low-weight check ---
  const hasHistory = booking.pastTrips > 0;
  if (!hasHistory) score += LOW_WEIGHT;
  checks.push({
    passed: hasHistory,
    label: hasHistory
      ? `Returning renter (${booking.pastTrips} past trips)`
      : "First-time renter (no past trips)",
  });

  return { level: toLevel(score), score, checks };
}

function toLevel(score: number): RiskLevel {
  if (score >= 4) return "High";
  if (score >= 2) return "Medium";
  return "Low";
}
