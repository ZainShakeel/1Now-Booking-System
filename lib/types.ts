// Shared types for the whole app. One source of truth so the API,
// UI and risk logic all agree on the shape of a booking.

export type BookingStatus = "pending" | "approved" | "declined";

export type RiskLevel = "Low" | "Medium" | "High";

// The raw booking request an operator receives. Dates are ISO strings
// so they travel cleanly over the mock API as JSON.
export interface Booking {
  id: string;
  renterName: string;
  carName: string;
  carValueUsd: number;
  pickupDate: string; // ISO date-time
  returnDate: string; // ISO date-time
  totalPriceUsd: number;
  status: BookingStatus;

  // Signals the risk check reads. These stand in for what real
  // ID / insurance checks and account history would provide.
  idVerified: boolean;
  insuranceConfirmed: boolean;
  accountCreatedAt: string; // ISO date-time
  pastTrips: number;
}

// One line in the fraud-check box. `passed` true = this check is fine
// (shown with a tick); false = it's a risk flag (shown with a cross).
// `label` is the short, single-line summary the operator reads.
export interface RiskCheck {
  label: string;
  passed: boolean;
}

// What the risk function returns: the level, the raw score, and the
// full checklist the operator reads.
export interface RiskResult {
  level: RiskLevel;
  score: number;
  checks: RiskCheck[];
}
