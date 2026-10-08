import { NextResponse } from "next/server";
import { updateBookingStatus, delay } from "@/lib/store";
import type { BookingStatus } from "@/lib/types";

// PATCH /api/bookings/[id]
// Body: { status: "approved" | "declined" }
// Updates the booking's status in the in-memory store. Adds a delay so
// the button's pending state is visible.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await delay(700);

  const { id } = await params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const status = body.status;
  if (status !== "approved" && status !== "declined") {
    return NextResponse.json(
      { error: "Status must be 'approved' or 'declined'." },
      { status: 400 },
    );
  }

  const updated = updateBookingStatus(id, status as BookingStatus);
  if (!updated) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({ booking: updated });
}
