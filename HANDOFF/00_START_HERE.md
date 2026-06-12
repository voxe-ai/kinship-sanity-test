# Kinship Landing — START HERE

This folder is the complete map of the Kinship Landing website: how it works, how to change it, and what to hand off. Built June 2026 after recovering the project.

## The documents
1. **VOXE_INTERNAL_RUNBOOK.md** — 🔧 *For Voxe engineers.* Architecture, all accounts/IDs, where credentials live, how to deploy, how to make any change, risk register. **Read this first to operate the site.**
2. **CLIENT_HANDOFF.md** — 📄 *For the client / a future agency.* Plain-English: what they can self-edit, how to edit the Homa menu, what needs a developer, what access to grant an agency.
3. **SESSION_CHANGELOG_2026-06-11.md** — 📋 The detailed record of what was recovered and shipped.

## Where the actual code lives
- **Source of truth (deploy from here):** GitHub `voxe-ai/kinship-sanity-test`
- **Local working clone:** `../LIVE_SOURCE_kinship/` (code only; `public/images` skipped on Windows — colon-in-folder-name)
- **Homa menu editor (Sanity studio) source:** `../homa-menu-studio/`
- **Credentials:** `C:\voxe-ai-claude\secrets\` (gitignored)
- **Old static snapshots (reference only — do NOT deploy):** `../KINSHIP_LIVE_PRODUCTION/`, `../KINSHIP_HOSTINGER_READY/`

## The 30-second status (as of 2026-06-11)
- ✅ Live: Jr. Queen Bunk fix, GA4 booking-tracking fix, **editable Homa menu** (`kinship-homa-menu.sanity.studio`).
- ⚠️ **Critical:** everything reverts Monday unless **Travis disables Hostinger's GitHub auto-deploy.** (Team emailed.)
- ⏳ Next: close the auto-publish loop after Travis's switch; (optional) Explore "make generic"; Explore formatting fix is blocked on Lauren.
