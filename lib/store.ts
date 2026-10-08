import type { Booking, BookingStatus } from "./types";
import { getMockBookings } from "./mockData";

// In-memory store shared by the route handlers. This lives for the
// lifetime of the server process — no database. Approvals and declines
// made through the API persist until the server restarts.
let bookings: Booking[] = getMockBookings();

export function listBookings(): Booking[] {
  return bookings;
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Booking | undefined {
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return undefined;
  booking.status = status;
  return booking;
}

// Small helper so route handlers can show off loading states.
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
