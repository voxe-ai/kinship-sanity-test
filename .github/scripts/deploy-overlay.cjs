// Voxe overlay deploy: upload built site (out/) to Hostinger over FTP.
// SAFETY: ONLY uploads/overwrites + creates folders. NEVER deletes anything.
// Robust against flaky Hostinger FTP: retries the whole connect+upload up to 4x
// with backoff. Idempotent (overlay re-upload), so retries are safe.
const ftp = require('basic-ftp');

const target = (process.env.DEPLOY_DIR || '').trim(); // blank = LIVE public_html root
const MAX_ATTEMPTS = 4;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function deployOnce() {
  const client = new ftp.Client(0); // no idle timeout; job timeout is the backstop
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
    console.log('Connected. Root cwd:', await client.pwd());
    if (target && target !== '/') {
      await client.ensureDir(target);
      console.log('Deploying into subdir:', await client.pwd());
    } else {
      console.log('Deploying into LIVE public_html root.');
    }
    console.log('Uploading out/ (overlay — no deletes)...');
    await client.uploadFromDir('out');
    const here = (await client.list()).map((f) => f.name);
    for (const k of ['index.html', 'rooms.html', 'homa.html']) {
      console.log((here.includes(k) ? 'OK   ' : 'MISS ') + k);
    }
  } finally {
    client.close();
  }
}

(async () => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await deployOnce();
      console.log(`Overlay deploy complete (attempt ${attempt}).`);
      return;
    } catch (e) {
      console.log(`Attempt ${attempt}/${MAX_ATTEMPTS} failed: ${e.message}`);
      if (attempt === MAX_ATTEMPTS) throw e;
      const wait = attempt * 20000; // 20s, 40s, 60s
      console.log(`Waiting ${wait / 1000}s before retry...`);
      await sleep(wait);
    }
  }
})().catch((e) => { console.error('DEPLOY ERROR:', e.message); process.exit(1); });
