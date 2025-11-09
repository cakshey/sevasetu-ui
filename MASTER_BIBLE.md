# SevaSetu — Master Project Bible

## Project purpose
Centralized UI for service marketplace + admin operations: bookings, providers, feedback, and financial analytics.

---

## Current Scope (completed)
- Home page, categories, feedback widget, auth, checkout flow
- Firestore cleanup utilities, backups
- Admin dashboard core and service reports
- Manual Vercel deployment working

---

## Next Scope: Financial & Admin Controls (this doc)
### Goals
1. Provide admin with revenue / cost / margin reports by category and area.
2. Allow admins to edit service pricing/provider cost/commission in UI and via Excel.
3. Provide safe import/export and audit logging.

---

## Data model (Firestore)
- **bookings**
  - fields: `serviceId`, `servicePrice`, `providerCost`, `commissionPercent`, `category`, `area`, `status`, `createdAt`, `userId`
- **services**
  - fields: `name`, `sellPrice` (or `servicePrice`), `providerCost`, `commissionPercent`, `category`, `area`
- **userSessions**
  - fields: `uid`, `email`, `name`, `loginTime`, `deviceInfo`, `location`

---

## Files added / modified
- `src/pages/AdminRevenueDashboard.jsx` ← (new)
- `src/pages/AdminRevenueDashboard.css` ← (new)
- `src/pages/AdminFinancialDashboard.jsx` (optional future)
- `src/pages/AdminServiceReports.jsx` ← (existing)
- `src/App.jsx` ← add route: `/admin-revenue`
- `MASTER_BIBLE.md` ← this file

---

## Implementation Steps (high level)
1. Add dashboard UI (cards, charts, editable table).
2. Wire real-time data using `onSnapshot()` for `bookings` and `services`.
3. Implement inline update (`updateDoc`) for `services`.
4. Implement Excel export and import using `xlsx`.
5. Add access control: route guarded by `ProtectedRoute` + Firestore rules.
6. Backup step: before import, auto-create backup snapshot (or require admin to upload backup).
7. QA: Validate numbers vs raw bookings manually for first week.
8. Rollout: enable to a limited admin group, then full rollout.

---

## Acceptance Criteria
- [ ] Admin can view total revenue, cost, profit and avg margin across platform.
- [ ] Charts show revenue vs cost by category and revenue share by area.
- [ ] Table lists services with editable `sellPrice`, `providerCost`, `commissionPercent`.
- [ ] Admin edits persist to Firestore and reflected in charts within 10s.
- [ ] Admin can export table to Excel and import modified Excel to update services.
- [ ] All imports create a timestamped backup in `/backups/services/`.
- [ ] Only authorized admins can perform edits / imports (enforced by UI + Firestore rules).

---

## Roles & Responsibilities
- **Dev (You)**: implement UI, attach routes, test with real data.
- **Ops**: define Firestore security rules & backups.
- **QA**: verify financial calculations vs raw bookings (spot check).
- **Product Owner**: confirm required fields and margin/commission logic.

---

## Rollout Plan
1. Deploy dashboard to staging (Vercel preview) and test with staging Firestore.
2. Run CSV/Excel import test with 10 rows and validate updated services.
3. Review financial numbers vs expected (spot-check 20 bookings).
4. Release to production and monitor for 24–48 hours.

---

## Notes & Next Enhancements
- Add date-range filters and charts per time range.
- Add "low-margin alert" rule (notify if margin < X%).
- Add provider payout report and reconciliation export for accounting.

---

## Quick Commands
- Install libs: `npm i chart.js react-chartjs-2 xlsx`
- Start dev: `npm start`
- Build & deploy: `npm run build` → `vercel --prod` (if using Vercel CLI)
