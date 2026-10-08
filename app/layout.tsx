import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Booking Requests — 1Now",
  description: "Review incoming booking requests with risk flags.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Browser extensions (password managers, etc.) often inject
          attributes onto <body> before React hydrates, which shows up as
          a dev-only hydration warning. suppressHydrationWarning scopes
          that off for the body element only. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
