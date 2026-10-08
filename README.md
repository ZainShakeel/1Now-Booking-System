# Booking Requests — with risk flags

A single screen for a car rental operator to review incoming booking
requests and decide which ones to **approve** or **decline**. Each
request shows a plain-language risk read so the operator can judge it in
seconds.

Built for the 1Now take-home assessment (Engineer/Developer role).

---

## The problem it solves

1Now's operators are small businesses — usually Turo hosts with about
5–25 cars — who take direct bookings on their own site. Every day they
have to decide which booking requests to accept. A bad renter can mean a
damaged or stolen car.

This screen puts the decision in one place. For each request the
operator sees the renter, the car, the dates and price, and a **risk
badge (Low / Medium / High)**. Opening a request shows, in plain
English, *why* it was flagged — so approving or declining is a quick,
informed call instead of a guess.

---

## What's in it

- A list of booking requests, each as a card: renter name, car, pickup
  and return dates, trip length, total price, and a risk badge. The
  **Pending** list is sorted by pickup date, soonest first, so the most
  urgent requests sit at the top.
- Three tabs — **Pending**, **Approved**, **Declined** — each with a live
  count.
- A **detail panel** with a **fraud & risk checklist** — every check
  shown as a pass (✓) or a risk flag (✗) on one line, so the operator
  sees the whole picture at a glance. Side-by-side with the list on
  desktop; a full-screen view on mobile.
- **Approve** and **Decline** actions, with a confirmation popup after
  each. Decline always asks for a quick confirmation first. **Approving a
  High-risk request** also asks "Approve anyway?" first; Low and Medium
  approve in one click.
- Loading skeleton, an empty state per tab, and an error state with a
  **Retry** button. Buttons show a pending state while saving, and a
  failed save shows a clear message.

---

## How risk is scored

Risk is calculated by a pure function in [`lib/risk.ts`](lib/risk.ts).
It adds up the weight of every signal that applies and maps the total to
a level:

| Signal                                                   | Weight |
| -------------------------------------------------------- | ------ |
| ID not verified                                          | **4**  |
| Insurance not confirmed                                  | **4**  |
| Renter account is less than 7 days old                   | **2**  |
| Pickup starts in less than 24 hours                      | **2**  |
| Trip longer than 14 days on a car worth over $60k        | **2**  |
| First-time renter with no past trips                     | **1**  |

| Total score | Level      |
| ----------- | ---------- |
| 4 or more   | **High**   |
| 2 or 3      | **Medium** |
| 0 or 1      | **Low**    |

**Why these numbers.** A single unverified ID or missing insurance (4)
is High on its own — as it should be. But a normal brand-new customer —
account under 7 days old (2) **plus** first-time renter (1) = 3 — lands
at **Medium**, not High. New customers are an operator's bread and
butter; flagging every one of them as High would make the whole screen
useless. The function returns both the level and the ordered list of
reasons shown in the UI.

---

## Running it

Requires Node.js 18.18+.

```bash
npm install
npm run dev
```

Then open the URL the terminal prints (usually
<http://localhost:3000>; if that port is busy, Next.js will pick the
next free one and print it).

Other scripts:

```bash
npm run build   # production build — also type-checks the whole app
npm test        # run the unit tests
```

---

## Demoing the states

- **Error state.** Tick **"Simulate load error"** at the top right of the
  screen, or hit the API directly with the flag:
  `GET /api/bookings?fail=1` returns a 500 so the error + Retry UI shows.
- **Loading state.** The mock API delays ~800ms on load and ~700ms on
  save, so the skeleton and the button pending states are visible.
- **Empty states.** One booking starts Approved and one starts Declined,
  so every tab has content on first load; approve or decline the last
  pending request to see the Pending empty state.

---

## Tests

Five Vitest unit tests on the risk function in
[`lib/risk.test.ts`](lib/risk.test.ts), covering:

- a clean renter → **Low**
- a single unverified ID → **High**
- both ID and insurance missing → **High**
- **new account + first-time renter → Medium** (the case that proves a
  normal new customer is not over-flagged)
- a fully-flagged booking → every reason listed, in order

```bash
npm test
```

---

## What I left out, and why

The assessment asked for a small, finished feature, so I deliberately
skipped:

- **Login / auth** — out of scope for one screen; it would add a lot of
  surface area without showing more product judgment.
- **Real ID & insurance verification** — these are represented as
  boolean signals on the mock data. In production they'd come from
  1Now's existing ID/insurance checks.
- **Real payments** — total price is shown but nothing is charged.
- **A database** — data lives in memory for the server's lifetime. An
  approve/decline persists until the server restarts. Swapping in a real
  DB would only touch [`lib/store.ts`](lib/store.ts).
- **Real Turo / calendar sync** — the bookings are mock fixtures.
- **Multiple pages, deployment config** — kept to the one screen asked
  for.

The data model and the API shape are deliberately close to what a real
version would use, so the UI and risk logic wouldn't change when the
mocks are replaced.

---

## What I'd build next

- Persist decisions to a real database and add an audit trail (who
  decided what, when).
- Let the operator add a note when declining (e.g. "ask for a deposit").
- Make the risk weights configurable per operator — some run pricier
  fleets and want stricter rules.
- Pull live ID/insurance results and account history from 1Now's
  backend instead of mock booleans.
- Add a "needs review" middle path and bulk actions for high-volume
  operators.

---

## A note on how this was built

This was built using **Claude and Claude Code only**, as the assessment
required. No other AI tools were used for the final work. Planning and
the risk-scoring rules were agreed first, then implemented, tested and
verified end to end.
