# Obliq Static Website Spec (Homepage + Platform Page)

Create a **static marketing website** for **Obliq** positioned as an **all-in-one Studio OS** for Pilates and yoga studios.

## Technical Constraints
- Static HTML/CSS/vanilla JS only.
- Shared assets are in `assets/site.css`, `assets/site.js`, `assets/chat.js`.
- Current routes:
  - `/` → homepage (`index.html`)
  - `/platform/` → platform detail page (`platform/index.html`)
- No external UI libraries.

## Global Experience Requirements
- Light mode, premium SaaS aesthetic.
- Fixed top header that stays visible while scrolling.
- Wide desktop layout (supports 1600px+ comfortably).
- Floating live chat button on all pages (bottom-right), with placeholder panel behavior.
- Footer includes explicit legal links:
  - Privacy Policy
  - Terms of Service

## Shared Navigation Requirements

### Desktop Nav
- Left: logo.
- Center headings: **Platform**, **Solutions**, **Pricing**, **Support**.
- Right CTA: **Book a Demo**.
- `Platform` opens a mega menu on hover/click/focus.
- Mega menu contains all 12 apps with title + short description + links.
- Mega menu includes an **Explore** link.
- Mega closes on:
  - mouse leave,
  - outside click,
  - Escape key.

### Mobile Nav
- Hamburger opens sheet/drawer.
- Root menu includes Platform, Solutions, Pricing, Support, Book a Demo.
- Tapping `Platform` drills into app list view with Back button.
- Selecting an app closes drawer.
- Drawer closes on Escape and outside click.
- Body scroll is locked while drawer is open.

## Platform App List (Canonical)
1. Dashboard — “Your studio command center.”
2. Scheduling — “Rules, availability, and conflicts handled.”
3. Classes — “Capacity, waitlists, check-ins.”
4. Appointments — “Private bookings with smart availability.”
5. Memberships — “Recurring revenue and retention.”
6. Passes — “Packs, intro offers, expiry rules.”
7. Services — “Sell add-ons, bundles, and sessions.”
8. Payments — “Integrated billing and payouts.”
9. Messaging — “1:1 and broadcast studio comms.”
10. Reporting — “Revenue, attendance, churn insights.”
11. Website Builder — “Pages that convert to bookings.”
12. Email Configurator — “Branded email + deliverability setup.”

---

## Homepage (`/`) Requirements

### Core Sections
1. Hero
2. Problem
3. Apps Grid (12 items)
4. Feature-to-Outcome Matrix
5. ROI Calculator / Value Snapshot
6. Built by Studio Owners
7. How It Works (3 steps)
8. Built for Pilates & Yoga
9. Pricing
10. Support
11. Final CTA
12. Privacy / Terms placeholders

### Homepage Interaction Requirements
- Hero carousel with:
  - centered active card,
  - smaller side cards,
  - swipe + keyboard + prev/next controls,
  - infinite loop behavior,
  - auto-scroll.
- Hero carousel title/subtitle shown outside card.
- Prev/Next controls overlay the carousel area.

---

## Platform Page (`/platform/`) Requirements

### Top of Page
- Under fixed header, show a **fixed horizontal platform menu strip**.
- Strip behavior:
  - full-width row,
  - same side padding as container gutters,
  - horizontally scrollable when needed,
  - centered when viewport is wider than chip content.
- Active chip behavior:
  - On scroll, current section chip gets `selected` state.
  - `selected` uses **2px brand accent border**.

### Platform Hero
- Centered intro section at top of platform page.
- Larger headline scale than homepage.
- Extra spacing above and below hero.

### Platform Item Sections
- One section per app item (12 total).
- Each section must include:
  - eyebrow (`kicker`),
  - title,
  - short description,
  - checklist points,
  - media/promo band.

### Section Composition Rules
- Vary section layouts (not repetitive two-column clones).
- Every third item is centered (`platform-centered`) with centered media treatment.
- For centered sections, checklist appears directly below description.
- For checklist-left sections:
  - larger vertical spacing between sections,
  - larger horizontal spacing between checklist and heading blocks,
  - additional desktop top padding.

### Media / Placeholder Requirements
- Each platform section includes an actual `<img>` placeholder (replace later with real screenshots).
- Use local asset placeholders (no external dependency).
- Media should be full-bleed style bands with overlay text/chips.
- Remove white panel look from media area.

### Scroll Animations
- Platform section elements animate **fade-in + slight upward slide** as they enter viewport.
- Reveal should run once per element.

---

## Visual Direction
- Airy, trustworthy, modern, boutique-fitness friendly.
- Brand accent: green (e.g., `#60D084`).
- Soft borders + subtle shadows where appropriate.
- Avoid overusing boxed panels on the platform narrative sections.
- Maintain strong readability across desktop/tablet/mobile.

## Maintainability Notes
- Keep semantics clean and section-based.
- Prefer class modifiers for layout variation (`layout-*`, `platform-centered`, etc.).
- Keep behavior scoped by page class (e.g., `platform-page`) to avoid homepage regressions.
