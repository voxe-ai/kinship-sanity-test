// Voxe overlay deploy: upload built site (out/) to Hostinger over FTP.
//
// SAFETY: ONLY uploads/overwrites + creates folders. NEVER deletes anything on the
// server (preserves the hand-managed live .htaccess, Google verification file, etc.).
//
// FAST + RESILIENT (Hostinger FTP is flaky):
//  - Walks out/ and uploads directory-by-directory (one LIST per dir, not per file).
//  - SKIPS any non-HTML file already on the server with a matching byte size
//    (skips the ~250 unchanged images/fonts/chunks). HTML pages are ALWAYS re-uploaded
//    so content/code changes always go live.
//  - Real 30s per-operation timeout, so a stalled transfer ERRORS instead of hanging.
//  - Because uploaded files are skipped next pass, a failed/dropped run RESUMES on retry
//    rather than starting over. Whole connect+sync retried up to 4x with backoff.
const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

const target = (process.env.DEPLOY_DIR || '').trim(); // blank = LIVE public_html root
const LOCAL_ROOT = 'out';
const MAX_ATTEMPTS = 4;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Recursively collect files under out/, tagged with their relative dir + byte size.
function walk(dir, rel = '') {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    const r = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...walk(abs, r));
    else if (entry.isFile()) files.push({ abs, name: entry.name, dir: rel, size: fs.statSync(abs).size });
  }
  return files;
}

async function uploadWithRetry(client, abs, name) {
  for (let i = 1; i <= 3; i++) {
    try { await client.uploadFrom(abs, name); return; }
    catch (e) { if (i === 3) throw e; await sleep(2000); }
  }
}

async function deployOnce(stats) {
  const client = new ftp.Client(30000); // 30s op timeout — stalls error, never hang
  client.ftp.verbose = false;
  try {
    await client.access({
      host: process.env.FTP_SERVER,
      port: 21,
      user: process.env.FTP_USERNAME,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });
    try { client.ftp.socket.setKeepAlive(true, 10000); } catch {}
    if (target && target !== '/') await client.ensureDir(target);
    const base = await client.pwd();
    console.log('Connected. Deploy base:', base);

    const allFiles = walk(LOCAL_ROOT);
    // Unique dirs, shallowest first so parents are created before children.
    const dirs = [...new Set(allFiles.map((f) => f.dir))].sort(
      (a, b) => a.split('/').length - b.split('/').length
    );

    for (const d of dirs) {
      await client.cd(base);
      if (d) await client.ensureDir(d); // creates nested dirs + cwds into the last
      const remote = {};
      try { for (const f of await client.list()) remote[f.name] = f.size; } catch {}
      for (const file of allFiles.filter((f) => f.dir === d)) {
        const isHtml = file.name.toLowerCase().endsWith('.html');
        if (!isHtml && remote[file.name] === file.size) { stats.skipped++; continue; }
        await uploadWithRetry(client, file.abs, file.name);
        stats.uploaded++;
      }
    }

    await client.cd(base);
    const here = (await client.list()).map((f) => f.name);
    for (const k of ['index.html', 'rooms.html', 'homa.html', 'explore.html']) {
      console.log((here.includes(k) ? 'OK   ' : 'MISS ') + k);
    }
    console.log(`Sync pass: uploaded ${stats.uploaded}, skipped ${stats.skipped}.`);
  } finally {
    client.close();
  }
}

(async () => {
  const stats = { uploaded: 0, skipped: 0 };
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await deployOnce(stats);
      console.log(`Overlay deploy complete (attempt ${attempt}).`);
      return;
    } catch (e) {
      console.log(`Attempt ${attempt}/${MAX_ATTEMPTS} failed: ${e.message}`);
      if (attempt === MAX_ATTEMPTS) throw e;
      const wait = attempt * 15000; // 15s, 30s, 45s — then resumes (skips done files)
      console.log(`Waiting ${wait / 1000}s before retry (will resume, not restart)...`);
      await sleep(wait);
    }
  }
})().catch((e) => { console.error('DEPLOY ERROR:', e.message); process.exit(1); });
