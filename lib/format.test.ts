import { describe, it, expect } from "vitest";
import { tripLengthDays, formatDate } from "./format";

describe("tripLengthDays", () => {
  it("counts whole days between two same-time dates", () => {
    expect(
      tripLengthDays("2026-10-17T15:00:00Z", "2026-10-20T15:00:00Z"),
    ).toBe(3);
  });

  // The bug this guards against: pickup and return had different
  // times-of-day, so the raw millisecond diff rounded to the wrong day
  // count. Counting by calendar day fixes it. Oct 9 -> Oct 11 is 2 days.
  it("counts by calendar day, ignoring time-of-day", () => {
    expect(
      tripLengthDays("2026-10-09T22:00:00Z", "2026-10-11T08:00:00Z"),
    ).toBe(2);
  });

  it("returns 1 for a next-day return", () => {
    expect(
      tripLengthDays("2026-10-01T09:00:00Z", "2026-10-02T18:00:00Z"),
    ).toBe(1);
  });
});

describe("formatDate", () => {
  // Fixed UTC formatting: this instant is Oct 20 in UTC and must render
  // as Oct 20 no matter what timezone the test machine is in.
  it("formats in a fixed UTC calendar day", () => {
    expect(formatDate("2026-10-20T15:09:06Z")).toBe("Oct 20, 2026");
  });
});
