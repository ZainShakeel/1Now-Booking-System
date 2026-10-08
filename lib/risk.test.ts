import { describe, it, expect } from "vitest";
import { assessRisk } from "./risk";
import type { Booking } from "./types";

// A fixed "now" so the time-based rules are deterministic in tests.
const NOW = new Date("2026-06-15T12:00:00.000Z");

// Base booking that is as safe as possible: verified, insured, old
// account, pickup well in the future, short trip, cheap car, and a
// returning renter. Each test overrides only the fields it cares about.
function makeBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: "test-1",
    renterName: "Test Renter",
    carName: "Honda Civic",
    carValueUsd: 25_000,
    pickupDate: "2026-07-01T10:00:00.000Z", // ~2 weeks out
    returnDate: "2026-07-04T10:00:00.000Z", // 3-day trip
    totalPriceUsd: 300,
    status: "pending",
    idVerified: true,
    insuranceConfirmed: true,
    accountCreatedAt: "2025-01-01T00:00:00.000Z", // old account
    pastTrips: 5,
    ...overrides,
  };
}

describe("assessRisk", () => {
  // Helper: labels of only the FAILED checks (the actual risk flags).
  const failedLabels = (r: ReturnType<typeof assessRisk>) =>
    r.checks.filter((c) => !c.passed).map((c) => c.label);

  it("returns Low for a clean, returning renter", () => {
    const result = assessRisk(makeBooking(), NOW);
    expect(result.level).toBe("Low");
    expect(result.score).toBe(0);
    // Every check should pass, so there are no risk flags.
    expect(failedLabels(result)).toEqual([]);
    // The checklist still lists all six checks (all as passes).
    expect(result.checks).toHaveLength(6);
    expect(result.checks.every((c) => c.passed)).toBe(true);
  });

  it("returns High when ID is not verified (single high signal)", () => {
    const result = assessRisk(makeBooking({ idVerified: false }), NOW);
    expect(result.level).toBe("High");
    expect(result.score).toBe(4);
    expect(failedLabels(result)).toContain("Driver's license not verified");
  });

  it("returns High when both ID and insurance are missing", () => {
    const result = assessRisk(
      makeBooking({ idVerified: false, insuranceConfirmed: false }),
      NOW,
    );
    expect(result.level).toBe("High");
    expect(result.score).toBe(8);
    expect(failedLabels(result)).toContain("Insurance not confirmed");
  });

  // The key case from the scoring change: a normal new customer should
  // read as Medium, not High. New account (2) + first-time renter (1) = 3.
  it("returns Medium for a new account plus first-time renter", () => {
    const result = assessRisk(
      makeBooking({
        accountCreatedAt: "2026-06-12T00:00:00.000Z", // 3 days before NOW
        pastTrips: 0,
      }),
      NOW,
    );
    expect(result.level).toBe("Medium");
    expect(result.score).toBe(3);
    expect(failedLabels(result)).toEqual([
      "New account (under 7 days old)",
      "First-time renter (no past trips)",
    ]);
  });

  it("flags every failed check, in priority order", () => {
    const result = assessRisk(
      makeBooking({
        idVerified: false, // high
        insuranceConfirmed: false, // high
        accountCreatedAt: "2026-06-14T00:00:00.000Z", // new account, medium
        pickupDate: "2026-06-15T18:00:00.000Z", // in 6h, medium
        returnDate: "2026-07-05T18:00:00.000Z", // 20-day trip
        carValueUsd: 85_000, // high-value car, medium
        pastTrips: 0, // low
      }),
      NOW,
    );
    expect(result.level).toBe("High");
    expect(failedLabels(result)).toEqual([
      "Driver's license not verified",
      "Insurance not confirmed",
      "New account (under 7 days old)",
      "Last-minute pickup (within 24 hours)",
      "Long trip (14+ days) on a high-value car",
      "First-time renter (no past trips)",
    ]);
  });
});
