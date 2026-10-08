import { NextResponse } from "next/server";
import { listBookings, delay } from "@/lib/store";

// GET /api/bookings
// Returns all booking requests. Adds an artificial delay so the UI
// loading skeleton is visible. Pass ?fail=1 to force a 500 so the
// error state can be demoed.
export async function GET(request: Request) {
  await delay(800);

  const { searchParams } = new URL(request.url);
  if (searchParams.get("fail") === "1") {
    return NextResponse.json(
      { error: "Something went wrong while loading booking requests." },
      { status: 500 },
    );
  }

  return NextResponse.json({ bookings: listBookings() });
}
