# Kinship Landing — Voxe Internal Runbook

**Audience:** Voxe AI engineers. Everything you need to operate, change, and redeploy the Kinship Landing site.
**Last updated:** 2026-06-11

---

## 1. What this site is (architecture)

A **Next.js app** that reads content from **Sanity CMS at *build time*** and exports to **static HTML**, which is served from **Hostinger**.

```
Sanity CMS (content)  ──build-time fetch──►  Next.js build (npm run build → /out)
                                                      │
                                                      ▼
                                          FTP overlay upload to Hostinger public_html
                                                      │
                                                      ▼
                                          https://www.kinshiplanding.com  (LiteSpeed)
```

- The deployed JS makes **no runtime Sanity calls** — content is baked in at build. **So content edits do NOT appear until a rebuild + redeploy happens.**

---

## 2. Accounts, IDs & where the keys live

| Thing | Value |
|---|---|
| Sanity project ID | `u2qzrboc` |
| Sanity dataset | `production` (public-readable) |
| Sanity org | `voxeai` (`omio4wfww`) |
| Live domain | https://www.kinshiplanding.com (Hostinger / LiteSpeed) |

**Sanity Studios (editing UIs):**
- `kinship-landing.sanity.studio` — the **original** studio (all page content: rooms, homepage, about, events, explore, etc.). **Built by Trey; its source code is LOST** (see Risks).
- `kinship-homa-menu.sanity.studio` — the **Homa menu editor we built** (source in `homa-menu-studio/`).

**GitHub:**
- `voxe-ai/kinship-sanity-test` — **OUR fork. This is the source of truth we build & deploy from.**
- `trey1mossman-ai/kinship-sanity-test` — Trey's original (upstream). Public. We forked from it.

**Credentials (all in `C:\voxe-ai-claude\secrets\`, gitignored — never commit):**
- `Sanity API token - Kinship Landing (Editor write).txt` — read+write content (mutations, seeding).
- `Sanity API token - Kinship Landing (Deploy Studio).txt` — deploy Sanity studios.
- `Sanity API token - Kinship Landing (Admin full).txt` — **actually Access Manager = read-only** for content (misnamed).
- `Hostinger - Kinship (Travis FTP).txt` — FTP: host `92.112.189.66`, user `u493155738.voxemarketing`, port 21, folder `public_html`.

**Claude Code permissions:** `~/.claude/settings.json` has allow-rules for `gh workflow run`, `gh api`, `gh run` (needed so the deploy isn't auto-blocked).

---

## 3. How to deploy (the website)

Deploys are **manual and supervised** (a deliberate choice). From anywhere with `gh` authed:

```
gh workflow run voxe-deploy-live.yml --repo voxe-ai/kinship-sanity-test --ref main -f target_dir=""
```

- `target_dir=""` (blank) → deploys to the LIVE `public_html` root.
- `target_dir="_voxe_test/"` → deploys to a throwaway folder (safe dry-run).
- The workflow: `npm ci` → `npm run build` (env: `NEXT_PUBLIC_SANITY_PROJECT_ID=u2qzrboc`, `NEXT_PUBLIC_SANITY_DATASET=production`) → strips `.htaccess` (preserves the hand-managed live one) → **no-delete FTP overlay** via `.github/scripts/deploy-overlay.cjs`.
- **Safety:** the overlay only uploads/overwrites; it NEVER deletes. So `.git`, the Google verification file, and the live `.htaccess` are untouched.
- **FTP is flaky** (Hostinger rate-limits after heavy use). The script auto-retries 4× with backoff. If a deploy fails on `ETIMEDOUT`, wait ~20 min and re-run.
- Watch a run: `gh run list --repo voxe-ai/kinship-sanity-test --workflow voxe-deploy-live.yml --limit 1`

**Restore point:** the `deploy` branch (commit `88d56dce`) in the fork is a byte-exact copy of the original live site. To roll back, deploy that branch's `out/` contents.

---

## 4. How to make a change (3 kinds)

**A. Edit existing CONTENT** (text, images, room info, menu, explore lists)
→ Edit in the relevant Sanity studio (or via the Editor token / a script) → **then run a deploy** (step 3) so the static site rebuilds with the new content.

**B. Change the FRONTEND** (layout, components, logic)
→ Edit code in a clone of `voxe-ai/kinship-sanity-test`, push to `main`, run a deploy. Run `npx tsc --noEmit` locally first — note `next.config.ts` has `ignoreBuildErrors:true` + `ignoreDuringBuilds:true`, so the build will NOT catch type/lint errors. Always tsc/lint locally.
  - ⚠️ Windows can't check out `public/images/Rooms Page:section` (colon in folder name). Use a **sparse checkout excluding `public/images`** for local code work; the Linux CI build handles it fine.

**C. Add/Change EDITABLE FIELDS** (schema)
→ For the Homa menu: edit `homa-menu-studio/schemaTypes/homaMenu.ts`, then `cd homa-menu-studio && SANITY_AUTH_TOKEN=<deploy-studio-token> npx sanity deploy`.
→ For OTHER pages: the original studio's source is lost — you'd reconstruct it (the `homa-menu-studio/` project is the template for how).

---

## 5. What we changed (2026-06 session) — see SESSION_CHANGELOG for detail
- **Jr. Queen Bunk** now shows on /rooms: removed the `excludeBunks` filter in `app/rooms/RoomsPageClient.tsx`; fixed its Sanity data (`roomsPage.rooms` → displayOrder 9, slug/id `jr-queen-bunk-suite`; Family→10, Camp Deck→11).
- **GA4/Ads booking tracking:** `components/HeroEnhanced/BookingWidget.tsx` — converted the JS form-submit to a real tracked `<a>` link.
- **Editable Homa menu:** seeded `homaMenu` doc (18 cats/120 items); built `kinship-homa-menu.sanity.studio`; wired the frontend (`getHomaMenu` in `lib/sanity/queries.ts`, `HomaMenuAccordion`, `HomaPageClient`, `app/homa/page.tsx`) to render from Sanity with the bundled menu as fallback.

---

## 6. Risk register / open items
1. **Monday auto-rebuild reverts everything** unless **Travis disables Hostinger's GitHub auto-deploy** (Trey's repo still has a Monday cron → Hostinger pulls → overwrites our deploys). This is the #1 dependency. Team emailed.
2. **Trey's original studio source is LOST** (was only on his MacBook; he's gone). To change editable fields on pages *other than the Homa menu*, reconstruct the schema (queries.ts + live content + seed scripts are the inputs).
3. **Auto-publish loop not wired:** the site is static, so menu/content edits need a deploy to appear. The Sanity "Deploy to Hostinger" webhook is currently **DISABLED**. After Travis flips the switch, wire a Sanity webhook → `voxe-ai/kinship-sanity-test` `repository_dispatch` → the deploy workflow, so edits auto-publish. (Needs a GitHub PAT for the webhook + re-adding the `repository_dispatch` trigger.)
4. **FTP flakiness:** Hostinger rate-limits after heavy use; deploys auto-retry but may need a 20-min cooldown.
5. **Repo ownership:** we forked Trey's public repo. Consider transferring/renaming under `voxe-ai` and severing upstream for a clean handoff.

---

## 7. People
- **Lauren** — main client contact
- **Bobby** — owner / decision-maker (marketing reviews)
- **Taylor** — client's paid marketing manager (GA4/Ads)
- **Travis (Blaney)** — manages the client's Hostinger
- **Trey Mossman** — original developer (no longer engaged; `trey1mossman-ai` on GitHub)
