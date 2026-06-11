// Voxe overlay deploy: upload the built site (out/) to Hostinger over FTP.
// SAFETY: ONLY uploads/overwrites and creates folders. NEVER deletes anything
// (so the Google verification file, live .htaccess, .git, etc. are untouched).
// Runs on Linux CI (handles the colon-in-folder-name Windows can't).
const ftp = require('basic-ftp');

const target = (process.env.DEPLOY_DIR || '').trim(); // blank = LIVE public_html root

async function connect() {
  const client = new ftp.Client(0); // 0 = no idle timeout; the 30-min job is the backstop
  client.ftp.verbose = false;
  await client.access({
    host: process.env.FTP_SERVER,
    port: 21,
    user: process.env.FTP_USERNAME,
    password: process.env.FTP_PASSWORD,
    secure: false,
  });
  try { client.ftp.socket.setKeepAlive(true, 10000); } catch {}
  return client;
}

(async () => {
  let client = await connect();
  try {
    console.log('Connected. Root cwd:', await client.pwd());
    if (target && target !== '/') {
      await client.ensureDir(target);
      console.log('Deploying into subdir:', await client.pwd());
    } else {
      console.log('Deploying into LIVE public_html root.');
    }

    console.log('Uploading out/ (overlay — no deletes)...');
    try {
      await client.uploadFromDir('out');
    } catch (e) {
      console.log('Upload interrupted (' + e.message + ') — reconnecting and retrying once...');
      client.close();
      client = await connect();
      if (target && target !== '/') await client.ensureDir(target);
      await client.uploadFromDir('out'); // idempotent overlay re-upload
    }

    const here = (await client.list()).map((f) => f.name);
    for (const k of ['index.html', 'rooms.html', 'homa.html']) {
      console.log((here.includes(k) ? 'OK   ' : 'MISS ') + k);
    }
    console.log('Overlay deploy complete.');
  } finally {
    client.close();
  }
})().catch((e) => { console.error('DEPLOY ERROR:', e.message); process.exit(1); });
