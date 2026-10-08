import type { Booking } from "./types";

// Helpers to build ISO dates relative to "now". Using relative dates
// (instead of hardcoded ones) means the "pickup < 24h" and
// "account < 7 days old" rules keep firing no matter when you run the app.
const now = Date.now();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const hoursFromNow = (h: number) => new Date(now + h * HOUR).toISOString();
const daysFromNow = (d: number) => new Date(now + d * DAY).toISOString();
const daysAgo = (d: number) => new Date(now - d * DAY).toISOString();

// 10 realistic requests tuned to cover Low, Medium and High risk.
// A fresh clone is returned each call so the in-memory API can mutate
// status without corrupting the original fixtures.
const bookings: Booking[] = [
  {
    id: "bk_1001",
    renterName: "Marcus Lee",
    carName: "Honda Civic 2022",
    carValueUsd: 24_000,
    pickupDate: daysFromNow(9),
    returnDate: daysFromNow(12),
    totalPriceUsd: 285,
    status: "pending",
    idVerified: true,
    insuranceConfirmed: true,
    accountCreatedAt: daysAgo(420),
    pastTrips: 14,
  },
  {
    id: "bk_1002",
    renterName: "Priya Nair",
    carName: "Toyota Corolla 2021",
    carValueUsd: 21_500,
    pickupDate: daysFromNow(5),
    returnDate: daysFromNow(8),
    totalPriceUsd: 240,
    status: "pending",
    idVerified: true,
    insuranceConfirmed: true,
    accountCreatedAt: daysAgo(90),
    pastTrips: 3,
  },
  {
    // New customer: new account (2) + first-time renter (1) = Medium.
    id: "bk_1003",
    renterName: "Dylan Carter",
    carName: "Mazda CX-5 2023",
    carValueUsd: 31_000,
    pickupDate: daysFromNow(6),
    returnDate: daysFromNow(10),
    totalPriceUsd: 460,
    status: "pending",
    idVerified: true,
    insuranceConfirmed: true,
    accountCreatedAt: daysAgo(2),
    pastTrips: 0,
  },
  {
    // Imminent pickup (2) + first-time renter (1) = Medium.
    id: "bk_1004",
    renterName: "Sofia Alvarez",
    carName: "Nissan Altima 2020",
    carValueUsd: 18_000,
    pickupDate: hoursFromNow(10),
    returnDate: daysFromNow(3),
    totalPriceUsd: 210,
    status: "pending",
    idVerified: true,
    insuranceConfirmed: true,
    accountCreatedAt: daysAgo(55),
    pastTrips: 0,
  },
  {
    // ID not verified (4) = High.
    id: "bk_1005",
    renterName: "Jordan Mills",
    carName: "Jeep Wrangler 2022",
    carValueUsd: 38_000,
    pickupDate: daysFromNow(4),
    returnDate: daysFromNow(7),
    totalPriceUsd: 520,
    status: "pending",
    idVerified: false,
    insuranceConfirmed: true,
    accountCreatedAt: daysAgo(30),
    pastTrips: 2,
  },
  {
    // ID not verified (4) + insurance not confirmed (4) + new (2)
    // + first-time (1) = clearly High.
    id: "bk_1006",
    renterName: "Victor Osei",
    carName: "BMW M4 2023",
    carValueUsd: 78_000,
    pickupDate: hoursFromNow(18),
    returnDate: daysFromNow(5),
    totalPriceUsd: 1_350,
    status: "pending",
    idVerified: false,
    insuranceConfirmed: false,
    accountCreatedAt: daysAgo(1),
    pastTrips: 0,
  },
  {
    // Long trip (20 days) on a high-value car (2) + first-time (1) = Medium.
    id: "bk_1007",
    renterName: "Hannah Brooks",
    carName: "Tesla Model S 2023",
    carValueUsd: 92_000,
    pickupDate: daysFromNow(8),
    returnDate: daysFromNow(28),
    totalPriceUsd: 3_200,
    status: "pending",
    idVerified: true,
    insuranceConfirmed: true,
    accountCreatedAt: daysAgo(200),
    pastTrips: 6,
  },
  {
    // Insurance not confirmed (4) = High.
    id: "bk_1008",
    renterName: "Eli Rosenberg",
    carName: "Ford Mustang 2021",
    carValueUsd: 42_000,
    pickupDate: daysFromNow(3),
    returnDate: daysFromNow(6),
    totalPriceUsd: 610,
    status: "pending",
    idVerified: true,
    insuranceConfirmed: false,
    accountCreatedAt: daysAgo(140),
    pastTrips: 4,
  },
  {
    // Already-approved example so the Approved tab is not empty on load.
    id: "bk_1009",
    renterName: "Grace Thompson",
    carName: "Subaru Outback 2022",
    carValueUsd: 29_000,
    pickupDate: daysFromNow(11),
    returnDate: daysFromNow(15),
    totalPriceUsd: 540,
    status: "approved",
    idVerified: true,
    insuranceConfirmed: true,
    accountCreatedAt: daysAgo(310),
    pastTrips: 9,
  },
  {
    // Already-declined example so the Declined tab is not empty on load.
    id: "bk_1010",
    renterName: "Tyler Nguyen",
    carName: "Chevrolet Camaro 2020",
    carValueUsd: 36_000,
    pickupDate: daysFromNow(2),
    returnDate: daysFromNow(5),
    totalPriceUsd: 480,
    status: "declined",
    idVerified: false,
    insuranceConfirmed: false,
    accountCreatedAt: daysAgo(1),
    pastTrips: 0,
  },
];

// Return a deep-ish copy so callers can mutate status safely.
export function getMockBookings(): Booking[] {
  return bookings.map((b) => ({ ...b }));
}
