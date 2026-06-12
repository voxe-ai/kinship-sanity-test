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

## STATUS: PAUSED 2026-06-11

**Done & live:** Jr. Queen Bunk fix, GA4 booking-tracking fix, **editable Homa menu** (`kinship-homa-menu.sanity.studio`). Handoff docs written + backed up to GitHub.

## What still needs to be done (when work resumes)

1. **🔴 CRITICAL — waiting on Travis.** He must disable Hostinger's GitHub auto-deploy **before Monday**, or the weekly rebuild overwrites everything we shipped. Emailed; not yet confirmed. *If this isn't done, re-deploy with the command in the Runbook §3 and chase Travis.*
2. **After Travis's switch — wire auto-publish.** The site is static, so edits only appear after a deploy. The Sanity "Deploy to Hostinger" webhook is currently **disabled**. Re-point it to `voxe-ai/kinship-sanity-test` so client/menu edits auto-publish. (See Runbook §6.)
3. **Explore formatting fix — BLOCKED on Lauren.** She reported something looks off on /explore but never sent specifics. When she does: it's a code fix → edit, push to `main`, deploy (Runbook §3). Quick.
4. **Optional — make Explore options "generic."** Explore is already editable today; decided to skip unless the client asks.

## How to deploy / change anything → see **VOXE_INTERNAL_RUNBOOK.md** (§3 deploy, §4 make a change).
