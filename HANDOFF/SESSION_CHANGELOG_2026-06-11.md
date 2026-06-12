# Kinship Landing — Work Log (June 2026)

The client returned needing edits they couldn't make. Voxe had sunsetted the project; the original developer (Trey) had left without a complete handoff. This log records what was recovered, decided, and shipped.

## Starting situation
- The local folder had only an **old static build + docs** — no editable source, no schema.
- The original developer's GitHub repo, Sanity schema source, and access were not in hand.

## Recovery (how we got back in)
- Confirmed the **live Sanity** project is `u2qzrboc` (public-readable) — became our ground truth.
- Found the deploy chain via the Sanity webhook: **Sanity → Trey's GitHub Actions → Hostinger**.
- Located the **frontend source**: public repo `trey1mossman-ai/kinship-sanity-test`. **Forked it to `voxe-ai/kinship-sanity-test`** (our source of truth) and secured a restore point (`deploy` branch `88d56dce` = exact live copy).
- Got **Hostinger FTP** access from Travis. Built and proved a **no-delete overlay FTP deploy** pipeline (GitHub Actions, manual trigger).
- Determined the original **Sanity Studio source is lost** (only on Trey's drive; he's gone).

## Shipped fixes (all LIVE on kinshiplanding.com)

**1. Jr. Queen Bunk now shows on /rooms**
- Root cause: a frontend filter `excludeBunks` (in `app/rooms/RoomsPageClient.tsx`) deliberately hid any "bunk" room from every filter tab.
- Fix: removed `excludeBunks`. Plus corrected the room's Sanity data (`roomsPage.rooms[_key=="7a088e8f2274"]`): `displayOrder` 9, `slug`/`id` → `jr-queen-bunk-suite`; bumped Family Suite→10, Camp Deck→11 to keep it grouped with the Jr. Queens.

**2. GA4 / Google Ads cross-domain booking tracking**
- Root cause: the "Check Availability" widget (`components/HeroEnhanced/BookingWidget.tsx`) navigated to direct-book.com via JavaScript (`window.open`/`window.location`), which GA4/Ads auto-linkers can't decorate — so `_gl`/`gclid` were lost.
- Fix: converted it to a real `<a href>` tracked link (URL rebuilt live from the date/guest selection; validation preserved; new-tab UX kept).
- **Client-side note for Taylor:** GA4 must list `direct-book.com` under Admin → Data Streams → Configure your domains for decoration to occur.

**3. Editable Homa menu (the #1 ask)**
- The menu was hardcoded (`components/homa/homa-menu-data.ts`). Made it editable:
  - **Seeded** the full menu into Sanity as a `homaMenu` document (18 categories, 120 items).
  - **Built & deployed a dedicated editor:** `kinship-homa-menu.sanity.studio` (source in `homa-menu-studio/`) — chosen over replacing the original studio (which we can't, no source) to avoid any risk to existing editing.
  - **Wired the frontend** to render from Sanity (`getHomaMenu` query; `HomaMenuAccordion`/`HomaPageClient`/`app/homa/page.tsx`) with the bundled menu as a permanent fallback.

## Deploy & safety decisions
- Deploys are **manual/supervised** FTP overlays (never delete; preserve the hand-managed live `.htaccess`).
- Disabled the Sanity "Deploy to Hostinger" webhook so content publishes couldn't trigger the *old* pipeline and revert our work.

## Still open (see Runbook §6)
- **Travis must disable Hostinger's GitHub auto-deploy before Monday** or the weekly rebuild reverts everything. (Team emailed.)
- Wire a new auto-publish webhook → our pipeline (post-switch) so edits go live automatically.
- Explore "make options generic" — optional refinement (Explore is already editable).
- Explore **formatting** fix — blocked awaiting Lauren's specifics (what's visually wrong).
